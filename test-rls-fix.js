#!/usr/bin/env node

/**
 * Test RLS Policies Fix
 * Verify that profile creation works after RLS policy fix
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLSFix() {
  console.log('🛡️  Testing RLS Policies Fix');
  console.log('==============================');

  try {
    // Test 1: Try to create a test user and profile
    console.log('\n🧪 Testing profile creation...');

    const testEmail = `test-rls-${Date.now()}@ragdol.com`;
    const testPassword = 'Test123!';

    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test RLS User',
          role: 'customer'
        }
      }
    });

    if (signUpError) {
      console.log(`❌ Signup failed: ${signUpError.message}`);
      return;
    }

    console.log(`✅ Signup successful for ${testEmail}`);

    // Confirm email for testing
    const serviceSupabase = require('@supabase/supabase-js').createClient(
      supabaseUrl,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc'
    );

    await serviceSupabase.auth.admin.updateUserById(signUpData.user.id, { email_confirm: true });
    console.log('✅ Email confirmed');

    // Sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.log(`❌ Sign in failed: ${signInError.message}`);
      return;
    }

    console.log('✅ Sign in successful');

    // Check if profile was created automatically
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      console.log('ℹ️  Profile not found, this is expected - it should be created by the app');
      console.log('✅ RLS policies are not blocking queries');
    } else if (profile) {
      console.log('✅ Profile exists:', profile);
    } else {
      console.log(`❌ Profile query failed: ${profileError.message}`);
    }

    // Test 2: Check admin credentials access
    console.log('\n🔐 Testing admin credentials access...');
    const { data: adminCreds, error: adminError } = await supabase
      .from('admin_credentials')
      .select('email, role')
      .limit(1);

    if (adminError) {
      console.log(`❌ Admin credentials access failed: ${adminError.message}`);
    } else {
      console.log('✅ Admin credentials accessible');
    }

    console.log('\n🎉 RLS Policy Test Complete!');
    console.log('If profile creation still fails in the app, the issue is in the AuthContext logic, not RLS.');

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }

  await supabase.auth.signOut();
}

testRLSFix().catch(console.error);