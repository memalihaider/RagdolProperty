#!/usr/bin/env node

/**
 * Test Database Authentication
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseAuth() {
  console.log('🔐 Testing Database Authentication');
  console.log('===================================');

  try {
    // Check if password_hash column exists
    console.log('1. Checking database schema...');
    const { data: users, error: schemaError } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .limit(5);

    if (schemaError) {
      console.log(`❌ Schema check failed: ${schemaError.message}`);
      return;
    }

    console.log('✅ Schema check passed');
    console.log('Users found:', users.length);

    // Check admin user
    console.log('\n2. Checking admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', 'admin@ragdol.com')
      .single();

    if (adminError) {
      console.log(`❌ Admin user not found: ${adminError.message}`);
      return;
    }

    console.log(`✅ Admin user found: ${adminUser.email}`);
    console.log(`Password hash exists: ${!!adminUser.password_hash}`);

    if (adminUser.password_hash) {
      // Test password verification
      console.log('\n3. Testing password verification...');
      const isValid = await bcrypt.compare('Admin123!', adminUser.password_hash);
      console.log(`Password verification result: ${isValid ? '✅ PASS' : '❌ FAIL'}`);

      if (!isValid) {
        console.log('❌ Password verification failed - the hash might be wrong');
        return;
      }
    } else {
      console.log('❌ No password hash found - SQL migration not run!');
      console.log('\n🔧 Please run this SQL in your Supabase SQL Editor:');
      console.log(`
-- Add password_hash column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update existing admin user with hashed password
UPDATE users
SET password_hash = '${await bcrypt.hash('Admin123!', 12)}'
WHERE email = 'admin@ragdol.com';

-- Update existing test user with hashed password
UPDATE users
SET password_hash = '${await bcrypt.hash('Test123!', 12)}'
WHERE email = 'test@example.com';
      `);
      return;
    }

    // Check profile
    console.log('\n4. Checking admin profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (profileError) {
      console.log(`❌ Profile check failed: ${profileError.message}`);
      return;
    }

    console.log(`✅ Profile found: ${profile.full_name || 'No name'} (${profile.role})`);

    console.log('\n🎉 Database authentication setup looks good!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseAuth();