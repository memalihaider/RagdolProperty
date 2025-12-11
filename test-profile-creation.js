#!/usr/bin/env node

/**
 * Test Profile Creation After RLS Fix
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileCreation() {
  console.log('👤 Testing Profile Creation After RLS Fix');
  console.log('==========================================');

  try {
    // Create a fresh test user
    const testEmail = `fresh-test-${Date.now()}@ragdol.com`;
    const testPassword = 'Test123!';

    console.log(`📧 Testing with fresh user: ${testEmail}`);

    // Step 1: Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      console.log(`❌ Signup failed: ${signUpError.message}`);
      return;
    }

    console.log('✅ Step 1: Auth signup successful');

    // Step 2: Confirm email using service role
    const serviceSupabase = createClient(
      supabaseUrl,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTEzMTk3NiwiZXhwIjoyMDgwNzA3OTc2fQ.BYPDQWBpziEqJlzM5yFU8Rqg2csTAM6dqvH-WMGUQIs'
    );

    const { error: confirmError } = await serviceSupabase.auth.admin.updateUserById(
      signUpData.user.id,
      { email_confirm: true }
    );

    if (confirmError) {
      console.log(`❌ Email confirmation failed: ${confirmError.message}`);
      return;
    }

    console.log('✅ Step 2: Email confirmed');

    // Step 3: Sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.log(`❌ Sign in failed: ${signInError.message}`);
      return;
    }

    console.log('✅ Step 3: User signed in');

    // Step 4: Manually create user record (simulating AuthContext)
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: signInData.user.id,
        email: testEmail,
        email_confirmed_at: new Date().toISOString(),
      });

    if (userError) {
      console.log(`❌ User record creation failed: ${userError.message}`);
      return;
    }

    console.log('✅ Step 4: User record created');

    // Step 5: Create profile (this is where RLS was blocking before)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: signInData.user.id,
        full_name: 'Fresh Test User',
        role: 'customer',
        email_verified: true,
      });

    if (profileError) {
      console.log(`❌ Profile creation failed: ${profileError.message}`);
      console.log('❌ RLS policies are still blocking profile creation');
      return;
    }

    console.log('✅ Step 5: Profile created successfully!');

    // Step 6: Verify profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (fetchError) {
      console.log(`❌ Profile fetch failed: ${fetchError.message}`);
    } else {
      console.log('✅ Step 6: Profile verified:', profile.full_name);
    }

    console.log('\n🎉 SUCCESS: RLS policies are working correctly!');
    console.log('Profile creation is no longer blocked.');

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }

  await supabase.auth.signOut();
}

testProfileCreation().catch(console.error);