#!/usr/bin/env node

/**
 * Test Admin Login Directly
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminLogin() {
  console.log('🔐 Testing Direct Admin Login');
  console.log('==============================');

  try {
    console.log('Testing admin@ragdol.com / Admin123!...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@ragdol.com',
      password: 'Admin123!'
    });

    if (error) {
      console.log(`❌ Admin login failed: ${error.message}`);
      return false;
    }

    console.log(`✅ Admin login successful for: ${data.user.email}`);

    // Check if admin credentials exist in the table
    const { data: adminCred, error: credError } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('email', 'admin@ragdol.com')
      .eq('is_active', true)
      .single();

    if (credError) {
      console.log(`⚠️  Admin credentials check failed: ${credError.message}`);
    } else {
      console.log(`✅ Admin credentials found: ${adminCred.role}`);
    }

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.log(`❌ Profile fetch failed: ${profileError.message}`);
    } else {
      console.log(`✅ Profile found: ${profile.full_name} (${profile.role})`);
    }

    return true;

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
    return false;
  }
}

testAdminLogin().then(() => {
  supabase.auth.signOut();
}).catch(console.error);