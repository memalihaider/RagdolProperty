#!/usr/bin/env node

/**
 * Admin User Creation Script
 * Manually create admin users in Supabase Auth
 */

const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTEzMTk3NiwiZXhwIjoyMDgwNzA3OTc2fQ.BYPDQWBpziEqJlzM5yFU8Rqg2csTAM6dqvH-WMGUQIs';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminUsers = [
  { email: 'admin@ragdol.com', password: 'Admin123!' },
  { email: 'superadmin@ragdol.com', password: 'Admin123!' },
  { email: 'manager@ragdol.com', password: 'Admin123!' }
];

async function createAdminUsers() {
  console.log('👑 Creating Admin Users in Supabase Auth');
  console.log('========================================');

  for (const admin of adminUsers) {
    try {
      console.log(`\n📧 Creating admin user: ${admin.email}`);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true, // Auto-confirm email for testing
        user_metadata: {
          full_name: 'Admin User',
          role: 'admin'
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`ℹ️  Admin user ${admin.email} already exists`);
          continue;
        }
        console.log(`❌ Failed to create ${admin.email}: ${authError.message}`);
        continue;
      }

      console.log(`✅ Created auth user: ${authData.user.id}`);

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: admin.email,
          email_confirmed_at: new Date().toISOString(),
        });

      if (userError) {
        console.log(`❌ Error creating user record: ${userError.message}`);
      } else {
        console.log('✅ User record created');
      }

      // Create admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: 'Admin User',
          role: 'admin',
          email_verified: true,
        });

      if (profileError) {
        console.log(`❌ Error creating admin profile: ${profileError.message}`);
      } else {
        console.log('✅ Admin profile created');
      }

    } catch (error) {
      console.log(`❌ Unexpected error for ${admin.email}: ${error.message}`);
    }
  }

  console.log('\n🎉 Admin user creation complete!');
  console.log('Now you can test admin login with: admin@ragdol.com / Admin123!');
}

createAdminUsers().catch(console.error);