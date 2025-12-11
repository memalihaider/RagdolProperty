// Test to simulate the exact error scenario
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simulate the fetchProfile function with improved error logging
const fetchProfile = async (userId) => {
  try {
    console.log(`🔍 Fetching profile for user: ${userId}`);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', {
        error: error || 'Unknown error',
        message: error?.message || 'No message available',
        details: error?.details || 'No details available',
        hint: error?.hint || 'No hint available',
        code: error?.code || 'No code available',
        userId,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : []
      });
      return null;
    } else {
      console.log('✅ Profile fetched successfully');
      return profile;
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
};

async function testFetchScenarios() {
  console.log('🧪 Testing Profile Fetch Scenarios');

  try {
    // Test 1: Valid user ID (should work if user exists)
    console.log('\n1️⃣  Testing with existing user ID...');
    // Let's try to get a user that might exist
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      await fetchProfile(existingUsers[0].id);
    } else {
      console.log('No existing users found');
    }

    // Test 2: Non-existent user ID
    console.log('\n2️⃣  Testing with non-existent user ID...');
    await fetchProfile('00000000-0000-0000-0000-000000000000');

    // Test 3: Invalid UUID format
    console.log('\n3️⃣  Testing with invalid user ID...');
    await fetchProfile('invalid-uuid');

    // Test 4: Empty string
    console.log('\n4️⃣  Testing with empty user ID...');
    await fetchProfile('');

    console.log('\n🎉 Fetch scenarios test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testFetchScenarios();