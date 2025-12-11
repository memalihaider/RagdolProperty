// Test script to verify profile creation with database triggers
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testProfileCreation() {
  console.log('🧪 Testing Profile Creation with Database Triggers');

  try {
    // Test 1: Create a test user directly in auth.users (simulating signup)
    console.log('\n1️⃣  Creating test user...');
    const testEmail = `trigger-test-${Date.now()}@ragdol.com`;
    const testPassword = 'TestPassword123!';

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Trigger Test User',
        phone: '+971501234567',
        user_type: 'customer'
      }
    });

    if (userError) {
      console.log('❌ User creation failed:', userError.message);
      return;
    }

    console.log('✅ Test user created:', userData.user?.id);

    // Test 2: Check if profile was automatically created by trigger
    console.log('\n2️⃣  Checking if profile was created by trigger...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for trigger

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user?.id)
      .single();

    if (profileError) {
      console.log('❌ Profile not found:', profileError.message);
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

    // Test 3: Test login with the created user
    console.log('\n3️⃣  Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
    } else {
      console.log('✅ Login successful');

      // Test 4: Test profile fetching during auth
      console.log('\n4️⃣  Testing profile fetching...');
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

    // Cleanup: Delete test user
    console.log('\n5️⃣  Cleaning up...');
    if (userData.user?.id) {
      await supabase.auth.admin.deleteUser(userData.user.id);
      console.log('✅ Test user deleted');
    }

    console.log('\n🎉 Profile creation test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testProfileCreation();