#!/usr/bin/env node

/**
 * Debug Profile Creation
 * Test profile creation directly
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTEzMTk3NiwiZXhwIjoyMDgwNzA3OTc2fQ.BYPDQWBpziEqJlzM5yFU8Rqg2csTAM6dqvH-WMGUQIs';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugProfiles() {
  console.log('🔍 Debugging Profile Creation');
  console.log('==============================');

  try {
    // Get a test user ID from auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log(`❌ Error listing users: ${usersError.message}`);
      return;
    }

    const testUser = users.users.find(u => u.email?.includes('testuser'));
    if (!testUser) {
      console.log('❌ No test user found');
      return;
    }

    console.log(`📧 Found test user: ${testUser.email} (ID: ${testUser.id})`);

    // Check if user record exists in custom users table
    const { data: userRecord, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUser.id)
      .single();

    if (userCheckError && userCheckError.code === 'PGRST116') {
      console.log('ℹ️  User record does not exist in users table, creating...');

      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          id: testUser.id,
          email: testUser.email,
          email_confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createUserError) {
        console.log(`❌ User record creation failed: ${createUserError.message}`);
        return;
      } else {
        console.log('✅ User record created:', newUser);
      }
    } else if (userRecord) {
      console.log('✅ User record exists:', userRecord);
    } else {
      console.log(`❌ Error checking user record: ${userCheckError.message}`);
      return;
    }

    // Now check/create profile
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUser.id)
      .single();

    if (checkError && checkError.code === 'PGRST116') {
      console.log('ℹ️  Profile does not exist, creating...');

      // Try to create profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: testUser.id,
          full_name: 'Test User',
          role: 'customer',
          email_verified: true,
        })
        .select()
        .single();

      if (createError) {
        console.log(`❌ Profile creation failed: ${createError.message}`);
        console.log('Error details:', {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code
        });
      } else {
        console.log('✅ Profile created successfully:', newProfile);
      }
    } else if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile);
    } else {
      console.log(`❌ Error checking profile: ${checkError.message}`);
    }

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }
}

debugProfiles().catch(console.error);