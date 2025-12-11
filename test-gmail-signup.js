// Test signup with Gmail address
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupWithGmail() {
  console.log('📧 Testing Signup with Gmail Address');

  try {
    // Clear any existing session
    await supabase.auth.signOut();

    // Use Gmail address
    const testEmail = `test.ragdol.${Date.now()}@gmail.com`;
    const testPassword = 'TestPassword123!';

    console.log(`📧 Testing signup for: ${testEmail}`);

    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          phone: '+971501234567',
          user_type: 'customer'
        }
      }
    });

    if (error) {
      console.log('❌ Signup failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return;
    }

    console.log('✅ Signup response received');
    console.log('User ID:', data.user?.id);
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');

    // Wait for profile creation
    console.log('⏳ Waiting for profile creation...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if profile was created
    if (data.user?.id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.log('❌ Profile not found:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
      } else {
        console.log('✅ Profile found:', {
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role
        });
      }
    }

    console.log('\n🎉 Gmail signup test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testSignupWithGmail();