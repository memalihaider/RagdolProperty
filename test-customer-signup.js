#!/usr/bin/env node

/**
 * Customer Account Creation Test Script
 * Run this to test the customer signup functionality
 *
 * Usage: node test-customer-signup.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
  console.error('❌ Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data
const testCustomers = [
  {
    email: 'customer@ragdol.com',
    password: 'Customer123!',
    fullName: 'Test Customer'
  },
  {
    email: 'testuser1@ragdol.com',
    password: 'Test123!',
    fullName: 'Test User One'
  },
  {
    email: 'testuser2@ragdol.com',
    password: 'Test123!',
    fullName: 'Test User Two'
  }
];

async function testCustomerSignup(customer) {
  console.log(`\n🧪 Testing signup for: ${customer.email}`);

  try {
    // Test signup
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: customer.email,
      password: customer.password,
      options: {
        data: {
          full_name: customer.fullName,
          role: 'customer'
        }
      }
    });

    if (signUpError) {
      console.log(`❌ Signup failed: ${signUpError.message}`);
      return false;
    }

    console.log(`✅ Signup successful for ${customer.email}`);

    // For testing purposes, let's manually confirm the email by updating the user
    // In production, users would need to confirm via email
    if (signUpData.user && !signUpData.user.email_confirmed_at) {
      console.log('📧 Manually confirming email for testing...');

      // Use service role to confirm email (this would normally be done via email link)
      const serviceSupabase = require('@supabase/supabase-js').createClient(
        supabaseUrl,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTEzMTk3NiwiZXhwIjoyMDgwNzA3OTc2fQ.BYPDQWBpziEqJlzM5yFU8Rqg2csTAM6dqvH-WMGUQIs'
      );

      const { error: confirmError } = await serviceSupabase.auth.admin.updateUserById(
        signUpData.user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.log(`⚠️  Could not auto-confirm email: ${confirmError.message}`);
        console.log('   User will need to confirm email manually');
        return false; // Can't test sign-in without confirmed email
      }

      console.log('✅ Email confirmed for testing');
    }

    // Wait a moment for triggers to execute
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Sign in the user to get proper authentication context
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: customer.email,
      password: customer.password,
    });

    if (signInError) {
      console.log(`❌ Sign in failed: ${signInError.message}`);
      return false;
    }

    console.log(`✅ Sign in successful`);

    // Now try to fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user?.id)
      .single();

    if (profileError) {
      console.log(`❌ Profile fetch failed: ${profileError.message}`);
      console.log(`Profile error details:`, {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      return false;
    }

    if (profile) {
      console.log(`✅ Profile created: ${profile.full_name} (${profile.role})`);
      return true;
    } else {
      console.log(`❌ Profile not found`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function testAdminLogin() {
  console.log('\n🔐 Testing admin login...');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@ragdol.com',
      password: 'Admin123!'
    });

    if (error) {
      console.log(`❌ Admin login failed: ${error.message}`);
      return false;
    }

    console.log(`✅ Admin login successful`);

    // Wait for profile to be available
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check admin profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (profileError) {
      console.log(`❌ Admin profile fetch failed: ${profileError.message}`);
      console.log(`Profile error details:`, {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      return false;
    }

    if (profile && profile.role === 'admin') {
      console.log(`✅ Admin profile verified: ${profile.full_name}`);
      return true;
    } else {
      console.log(`❌ Admin profile not found or incorrect role`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Admin login error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Customer Account Creation Tests');
  console.log('==========================================');

  // Test admin login first
  const adminLoginSuccess = await testAdminLogin();

  // Test customer signups
  let customerSuccessCount = 0;
  for (const customer of testCustomers) {
    const success = await testCustomerSignup(customer);
    if (success) customerSuccessCount++;
  }

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Admin Login: ${adminLoginSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Customer Signups: ${customerSuccessCount}/${testCustomers.length} ✅ PASS`);

  if (adminLoginSuccess && customerSuccessCount === testCustomers.length) {
    console.log('\n🎉 All tests passed! Customer account creation is working.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }

  // Sign out
  await supabase.auth.signOut();
}

// Run the tests
runTests().catch(console.error);