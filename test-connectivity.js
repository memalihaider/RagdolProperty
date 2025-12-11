// Basic Supabase connectivity test
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBasicConnectivity() {
  console.log('🔗 Testing Basic Supabase Connectivity');

  try {
    // Test 1: Check connection
    console.log('\n1️⃣  Testing connection...');
    const { data: health, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      console.log('❌ Connection test failed:', {
        message: healthError.message,
        details: healthError.details,
        hint: healthError.hint,
        code: healthError.code
      });
    } else {
      console.log('✅ Connection successful');
    }

    // Test 2: Check auth status
    console.log('\n2️⃣  Testing auth status...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.log('❌ Auth status check failed:', sessionError.message);
    } else {
      console.log('✅ Auth status check successful');
      console.log('Current session:', session ? 'Active' : 'None');
    }

    // Test 3: Try a simple auth operation (get user)
    console.log('\n3️⃣  Testing auth user retrieval...');
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.log('❌ User retrieval failed:', {
        message: userError.message,
        details: userError.details,
        hint: userError.hint,
        code: userError.code
      });
    } else {
      console.log('✅ User retrieval successful');
      console.log('User:', user.user ? 'Present' : 'None');
    }

    console.log('\n🎉 Basic connectivity test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testBasicConnectivity();