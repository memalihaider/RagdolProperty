// Test signup with email confirmation disabled
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create a fresh client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupWithoutConfirmation() {
  console.log('📧 Testing Signup without Email Confirmation');

  try {
    // First, clear any existing session
    console.log('\n1️⃣  Clearing existing session...');
    await supabase.auth.signOut();

    // Generate unique test email
    const testEmail = `test-${Date.now()}@ragdol.com`;
    const testPassword = 'TestPassword123!';

    console.log(`📧 Testing signup for: ${testEmail}`);

    // Test signup with email confirmation disabled
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          phone: '+971501234567',
          user_type: 'customer'
        },
        emailRedirectTo: undefined // Disable email redirect
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
    console.log('User created:', data.user?.id);
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');

    // If user was created but not confirmed, try to confirm manually (for testing)
    if (data.user && !data.user.email_confirmed_at) {
      console.log('\n2️⃣  User created but not confirmed, checking if we can proceed...');

      // Wait a moment and check if profile was created despite email confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try to sign in (this might work if email confirmation is not strictly required)
      console.log('\n3️⃣  Attempting login...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (loginError) {
        console.log('❌ Login failed (expected if email confirmation required):', {
          message: loginError.message,
          details: loginError.details,
          hint: loginError.hint,
          code: loginError.code
        });
      } else {
        console.log('✅ Login successful despite no email confirmation');

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginData.user?.id)
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

        // Logout
        await supabase.auth.signOut();
      }
    }

    console.log('\n🎉 Signup test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testSignupWithoutConfirmation();