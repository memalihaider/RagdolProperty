// Enable real-time on database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function enableRealTime() {
  console.log('🔄 Enabling real-time on database tables...');

  try {
    // Enable replica identity for tables
    const tables = ['properties', 'enquiries', 'profiles', 'users'];

    for (const table of tables) {
      console.log(`Enabling replica identity for ${table}...`);
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${table} REPLICA IDENTITY FULL;`
      });

      if (error) {
        console.log(`❌ Failed to enable replica identity for ${table}:`, error.message);
      } else {
        console.log(`✅ Enabled replica identity for ${table}`);
      }
    }

    // Create publication for real-time
    console.log('Creating publication for real-time...');
    const { error: pubError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR ALL TABLES;'
    });

    if (pubError) {
      console.log('❌ Failed to create publication:', pubError.message);
    } else {
      console.log('✅ Created publication for real-time');
    }

    console.log('🎉 Real-time setup completed!');

  } catch (err) {
    console.error('❌ Error enabling real-time:', err.message);
  }
}

enableRealTime();