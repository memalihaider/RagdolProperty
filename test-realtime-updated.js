// Test Real-Time Functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRealTime() {
  console.log('🧪 Testing Real-Time Functionality');
  console.log('===================================');

  try {
    // Sign in as admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@ragdol.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.log(`❌ Admin login failed: ${authError.message}`);
      return;
    }

    console.log('✅ Admin authenticated');

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
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active, creating test property...');
          createTestProperty();
        }
      });

    console.log('⏳ Setting up real-time subscription...');

  } catch (err) {
    console.error('❌ Real-time test error:', err.message);
  }
}

async function createTestProperty() {
  try {
    console.log('🏠 Creating test property...');

    const { data, error } = await adminSupabase
      .from('properties')
      .insert({
        title: `Real-Time Test Property ${Date.now()}`,
        type: 'apartment',
        status: 'sale',
        property_status: 'ready',
        price: 1000000,
        currency: 'AED',
        beds: 1,
        baths: 1,
        sqft: 800,
        address: 'Test Address',
        city: 'Dubai',
        published: true,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Property creation failed:', error.message);
    } else {
      console.log('✅ Test property created:', data.title);

      // Wait a bit then update it
      setTimeout(() => {
        updateTestProperty(data.id);
      }, 2000);
    }
  } catch (err) {
    console.error('❌ Property creation error:', err.message);
  }
}

async function updateTestProperty(propertyId) {
  try {
    console.log('🔄 Updating test property...');

    const { error } = await adminSupabase
      .from('properties')
      .update({
        property_status: 'sold',
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId);

    if (error) {
      console.log('❌ Property update failed:', error.message);
    } else {
      console.log('✅ Test property updated to sold');
    }
  } catch (err) {
    console.error('❌ Property update error:', err.message);
  }
}

testRealTime();