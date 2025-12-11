// Simple test to check if database trigger creates profiles
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupFlow() {
  console.log('🧪 Testing Signup Flow with Database Triggers');

  try {
    // Generate unique test email
    const testEmail = `test-${Date.now()}@ragdol.com`;
    const testPassword = 'TestPassword123!';

    console.log(`📧 Testing signup for: ${testEmail}`);

    // Test signup (this should trigger profile creation)
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          phone: '+971501234567',
          user_type: 'customer'
        }
      }
    });

    if (error) {
      console.log('❌ Signup failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return;
    }

    console.log('✅ Signup successful, user created:', data.user?.id);

    // Wait a moment for trigger to execute
    console.log('⏳ Waiting for profile creation trigger...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check if profile was created
    if (data.user?.id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.log('❌ Profile not found:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
      } else {
        console.log('✅ Profile automatically created by trigger:');
        console.log('Profile data:', {
          id: profile.id,
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role,
          email_verified: profile.email_verified
        });
      }
    }

    // Test login
    console.log('\n🔐 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (loginError) {
      console.log('❌ Login failed:', {
        message: loginError.message,
        details: loginError.details,
        hint: loginError.hint,
        code: loginError.code
      });
    } else {
      console.log('✅ Login successful');

      // Test profile fetch during auth
      const { data: fetchedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', loginData.user?.id)
        .single();

      if (fetchError) {
        console.log('❌ Profile fetch failed:', {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code
        });
      } else {
        console.log('✅ Profile fetch successful');
      }

      // Logout
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Signup flow test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testSignupFlow();