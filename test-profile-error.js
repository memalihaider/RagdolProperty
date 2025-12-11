// Test profile fetching error logging
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileFetchError() {
  console.log('🧪 Testing Profile Fetch Error Logging');

  try {
    // Test 1: Try to fetch a profile for a non-existent user
    console.log('\n1️⃣  Testing fetch for non-existent user...');
    const fakeUserId = '00000000-0000-0000-0000-000000000000';

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', fakeUserId)
      .single();

    if (error) {
      console.log('✅ Error occurred (expected):');
      console.log('Error object:', error);
      console.log('Error type:', typeof error);
      console.log('Error keys:', Object.keys(error));
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
    } else {
      console.log('❌ No error occurred (unexpected)');
    }

    // Test 2: Try to fetch with invalid query
    console.log('\n2️⃣  Testing invalid query...');
    const { data: invalidData, error: invalidError } = await supabase
      .from('profiles')
      .select('*')
      .eq('invalid_column', 'test')
      .single();

    if (invalidError) {
      console.log('✅ Invalid query error occurred:');
      console.log('Error object:', invalidError);
      console.log('Error type:', typeof invalidError);
      console.log('Error keys:', Object.keys(invalidError));
    } else {
      console.log('❌ No error occurred for invalid query');
    }

    console.log('\n🎉 Profile fetch error test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testProfileFetchError();