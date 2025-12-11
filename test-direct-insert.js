// Test direct profile insertion with service role
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDirectProfileInsertion() {
  console.log('🔧 Testing Direct Profile Insertion with Service Role');

  try {
    // Generate a test UUID
    const testUserId = '550e8400-e29b-41d4-a716-446655440' + Math.floor(Math.random() * 1000);

    console.log(`🆔 Testing with user ID: ${testUserId}`);

    // Test direct insertion with service role (should bypass RLS)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        full_name: 'Direct Insert Test',
        phone: '+971501234567',
        role: 'customer',
        email_verified: true
      })
      .select();

    if (profileError) {
      console.log('❌ Direct profile insertion failed:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
    } else {
      console.log('✅ Direct profile insertion successful');
      console.log('Profile:', profile[0]);

      // Clean up
      await supabase.from('profiles').delete().eq('id', testUserId);
      console.log('🧹 Test profile cleaned up');
    }

    // Test if we can query profiles
    console.log('\n2️⃣  Testing profile queries...');
    const { data: profiles, error: queryError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (queryError) {
      console.log('❌ Profile query failed:', {
        message: queryError.message,
        details: queryError.details,
        hint: queryError.hint,
        code: queryError.code
      });
    } else {
      console.log('✅ Profile query successful, count available');
    }

    console.log('\n🎉 Direct insertion test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testDirectProfileInsertion();