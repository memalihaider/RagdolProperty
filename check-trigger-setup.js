// Check if database trigger is properly created
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTrigger() {
  console.log('🔍 Checking Database Trigger Setup');

  try {
    // Check if the trigger function exists
    console.log('\n1️⃣  Checking trigger function...');
    const { data: functions, error: funcError } = await supabase.rpc('exec_sql', {
      sql: "SELECT routine_name FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';"
    });

    if (funcError) {
      console.log('❌ Error checking functions:', funcError.message);
    } else {
      console.log('Functions found:', functions);
    }

    // Check if the trigger exists
    console.log('\n2️⃣  Checking trigger...');
    const { data: triggers, error: trigError } = await supabase.rpc('exec_sql', {
      sql: "SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created' AND event_object_schema = 'auth';"
    });

    if (trigError) {
      console.log('❌ Error checking triggers:', trigError.message);
    } else {
      console.log('Triggers found:', triggers);
    }

    // Check RLS policies
    console.log('\n3️⃣  Checking RLS policies...');
    const { data: policies, error: polError } = await supabase.rpc('exec_sql', {
      sql: "SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'profiles';"
    });

    if (polError) {
      console.log('❌ Error checking policies:', polError.message);
    } else {
      console.log('RLS Policies:', policies);
    }

    // Try to manually create a profile to test RLS
    console.log('\n4️⃣  Testing manual profile creation...');
    const testUserId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        full_name: 'Test Profile',
        phone: '+971501234567',
        role: 'customer',
        email_verified: true
      });

    if (profileError) {
      console.log('❌ Manual profile creation failed:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
    } else {
      console.log('✅ Manual profile creation successful');

      // Clean up
      await supabase.from('profiles').delete().eq('id', testUserId);
    }

  } catch (error) {
    console.error('❌ Check error:', error);
  }
}

// Run the check
checkTrigger();