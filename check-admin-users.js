#!/usr/bin/env node

/**
 * Check Admin Users in Supabase Auth
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

async function checkAdminUsers() {
  console.log('👑 Checking Admin Users in Supabase Auth');
  console.log('========================================');

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.log(`❌ Error listing users: ${error.message}`);
      return;
    }

    const adminUsers = users.users.filter(u => u.email?.includes('@ragdol.com'));
    console.log(`Found ${adminUsers.length} @ragdol.com users:`);

    adminUsers.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
      console.log(`  Created: ${user.created_at}`);
      console.log(`  Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    });

    // Confirm admin emails and reset passwords
    const adminEmails = ['admin@ragdol.com', 'superadmin@ragdol.com', 'manager@ragdol.com'];

    for (const adminUser of adminUsers) {
      if (adminEmails.includes(adminUser.email)) {
        console.log(`\n🔧 Setting up ${adminUser.email}...`);

        const { error: updateError } = await supabase.auth.admin.updateUserById(
          adminUser.id,
          {
            password: 'Admin123!',
            email_confirm: true
          }
        );

        if (updateError) {
          console.log(`❌ Setup failed for ${adminUser.email}: ${updateError.message}`);
        } else {
          console.log(`✅ Setup successful for ${adminUser.email}`);
        }
      }
    }

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }
}

checkAdminUsers().catch(console.error);