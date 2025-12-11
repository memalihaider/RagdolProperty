// Script to check and fix RLS policies for profiles table
// This addresses the profile creation errors

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixRLSPolicies() {
  console.log('🔍 Checking RLS policies for profiles table...');

  try {
    // Check current RLS policies
    console.log('\n1️⃣  Checking current RLS policies...');
    const { data: policies, error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
        FROM pg_policies
        WHERE tablename = 'profiles'
        ORDER BY policyname;
      `
    });

    if (policyError) {
      console.log('❌ Error checking policies:', policyError.message);
    } else {
      console.log('Current RLS policies for profiles table:');
      if (policies && policies.length > 0) {
        policies.forEach((policy, index) => {
          console.log(`${index + 1}. ${policy.policyname} (${policy.cmd})`);
          console.log(`   Roles: ${policy.roles || 'all'}`);
          console.log(`   Condition: ${policy.qual || 'none'}`);
        });
      } else {
        console.log('ℹ️  No RLS policies found');
      }
    }

    // Check if RLS is enabled
    console.log('\n2️⃣  Checking if RLS is enabled...');
    const { data: rlsEnabled, error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, rowsecurity
        FROM pg_tables
        WHERE tablename = 'profiles' AND schemaname = 'public';
      `
    });

    if (rlsError) {
      console.log('❌ Error checking RLS status:', rlsError.message);
    } else {
      console.log('RLS enabled:', rlsEnabled?.[0]?.rowsecurity || false);
    }

    // Try to create a test profile to see the exact error
    console.log('\n3️⃣  Testing profile creation...');
    const testUserId = 'test-user-' + Date.now();
    const { error: testError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        full_name: 'Test User',
        role: 'customer',
        email_verified: true
      });

    if (testError) {
      console.log('❌ Profile creation failed with error:', {
        message: testError.message,
        details: testError.details,
        hint: testError.hint,
        code: testError.code
      });

      // Suggest RLS policy fix
      console.log('\n💡 Suggested RLS Policy Fix:');
      console.log('Create or update the RLS policy to allow users to insert their own profiles:');
      console.log(`
-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own profiles
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy for users to view their own profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profiles
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to manage all profiles (for admin operations)
CREATE POLICY "Service role can manage all profiles" ON profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
      `);
    } else {
      console.log('✅ Profile creation successful');
      // Clean up test profile
      await supabase.from('profiles').delete().eq('id', testUserId);
    }

    // Alternative: Suggest using database triggers
    console.log('\n🔧 Alternative Solution - Database Trigger:');
    console.log('Create a database trigger to automatically create profiles on user signup:');
    console.log(`
-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email_verified)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'user_type', 'customer'),
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

  } catch (error) {
    console.error('❌ Error in RLS policy check:', error);
  }
}

// Run the check
checkAndFixRLSPolicies();