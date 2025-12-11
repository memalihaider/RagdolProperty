#!/usr/bin/env node

/**
 * Create Database Users Script
 * Creates users directly in our custom database tables
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createDatabaseUsers() {
  console.log('👤 Creating Database Users');
  console.log('===========================');

  const users = [
    {
      email: 'admin@ragdol.com',
      password: 'Admin123!',
      fullName: 'Admin User',
      role: 'admin'
    },
    {
      email: 'test@example.com',
      password: 'Test123!',
      fullName: 'Test User',
      role: 'customer'
    }
  ];

  for (const userData of users) {
    try {
      console.log(`\n📧 Creating user: ${userData.email}`);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        console.log(`ℹ️  User ${userData.email} already exists, updating password...`);

        // Update password hash
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const { error: updateError } = await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('email', userData.email);

        if (updateError) {
          console.log(`❌ Failed to update password: ${updateError.message}`);
        } else {
          console.log(`✅ Password updated for ${userData.email}`);
        }
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: hashedPassword,
          email_confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        console.log(`❌ Failed to create user: ${userError.message}`);
        continue;
      }

      console.log(`✅ User created with ID: ${newUser.id}`);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role,
          email_verified: true,
        });

      if (profileError) {
        console.log(`❌ Failed to create profile: ${profileError.message}`);
        // Clean up user if profile creation fails
        await supabase.from('users').delete().eq('id', newUser.id);
      } else {
        console.log(`✅ Profile created for ${userData.email}`);
      }

    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error);
    }
  }

  console.log('\n🎉 Database user creation completed!');
  console.log('\nTest these credentials:');
  console.log('Admin: admin@ragdol.com / Admin123!');
  console.log('Customer: test@example.com / Test123!');
}

createDatabaseUsers();