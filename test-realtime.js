// Test Real-Time Functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealTime() {
  console.log('🧪 Testing Real-Time Functionality');
  console.log('===================================');

  try {
    // Create a test user for real-time testing
    const testEmail = `test-${Date.now()}@ragdol.com`;
    const testPassword = 'Test123!';

    console.log('📝 Creating test user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          role: 'customer'
        }
      }
    });

    if (signUpError) {
      console.log(`❌ User creation failed: ${signUpError.message}`);
      return;
    }

    console.log('✅ Test user created');

    // Sign in with the test user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (authError) {
      console.log(`❌ Login failed: ${authError.message}`);
      return;
    }

    console.log('✅ User authenticated');

    // Set up real-time subscription
    const subscription = supabase
      .channel('test_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('🎉 Real-time event received:', payload.eventType, payload.new?.title || payload.old?.title);
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    console.log('⏳ Listening for real-time events... (Press Ctrl+C to stop)');

    // Keep the script running
    setInterval(() => {
      // Keep alive
    }, 1000);

  } catch (err) {
    console.error('❌ Real-time test error:', err.message);
  }
}

testRealTime();