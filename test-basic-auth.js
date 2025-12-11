// Very basic auth test
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('🔑 Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function basicAuthTest() {
  console.log('🧪 Basic Auth Test');

  try {
    // Test 1: Just check if the client can be created
    console.log('✅ Supabase client created successfully');

    // Test 2: Try to get the current session (should be null)
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ getSession failed:', error.message);
    } else {
      console.log('✅ getSession worked, session:', data.session ? 'Present' : 'Null');
    }

    // Test 3: Try a simple database query
    const { data: profiles, error: dbError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (dbError) {
      console.log('❌ Database query failed:', dbError.message);
    } else {
      console.log('✅ Database query worked');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

basicAuthTest();