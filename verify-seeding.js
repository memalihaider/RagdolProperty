#!/usr/bin/env node

/**
 * Database Verification Script
 * Check if the seeding was successful
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

async function verifySeeding() {
  console.log('🔍 Verifying Database Seeding');
  console.log('==============================');

  try {
    // Check admin credentials
    console.log('\n📋 Checking admin_credentials table...');
    const { data: adminCreds, error: adminError } = await supabase
      .from('admin_credentials')
      .select('*');

    if (adminError) {
      console.log(`❌ Error fetching admin credentials: ${adminError.message}`);
    } else {
      console.log(`✅ Found ${adminCreds.length} admin credentials:`);
      adminCreds.forEach(cred => {
        console.log(`   - ${cred.email} (${cred.role}) - Active: ${cred.is_active}`);
      });
    }

    // Check tables exist and have data
    console.log('\n📊 Checking table counts...');
    const tables = ['users', 'profiles', 'properties', 'admin_credentials'];
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ Error counting ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ Error accessing ${table}: ${err.message}`);
      }
    }

    // Check RLS status
    console.log('\n🔒 Checking RLS status...');
    const { data: rlsData, error: rlsError } = await supabase.rpc('get_rls_status');

    if (rlsError) {
      console.log(`⚠️  Could not check RLS status: ${rlsError.message}`);
    } else {
      console.log('✅ RLS status retrieved');
    }

  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }
}

verifySeeding().catch(console.error);