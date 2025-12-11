const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCustomerAuth() {
  console.log('🧪 Testing Customer Authentication Flow');
  console.log('=====================================');

  try {
    // Generate unique test email
    const testEmail = `customer-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    console.log(`📧 Testing with email: ${testEmail}`);
    console.log();

    // 1. Test Signup
    console.log('1️⃣  Testing Customer Signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test Customer',
          phone: '+971501234567',
          user_type: 'customer'
        }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', {
        message: signupError.message,
        status: signupError.status,
        code: signupError.code
      });
      return;
    }

    console.log('✅ Signup successful!');
    console.log('   User ID:', signupData.user?.id);
    console.log('   Email confirmed:', signupData.user?.email_confirmed_at ? 'Yes' : 'No (check email)');
    console.log();

    // 2. Test Signin
    console.log('2️⃣  Testing Customer Signin...');
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signinError) {
      console.error('❌ Signin failed:', {
        message: signinError.message,
        status: signinError.status,
        code: signinError.code
      });

      // If email not confirmed, that's expected
      if (signinError.message.includes('Email not confirmed')) {
        console.log('ℹ️  Email confirmation required - this is normal for new signups');
      }
      return;
    }

    console.log('✅ Signin successful!');
    console.log('   User authenticated:', signinData.user?.email);
    console.log('   Session created:', !!signinData.session);
    console.log();

    // 3. Test Profile Creation/Access
    console.log('3️⃣  Testing Profile Access...');
    const userId = signinData.user?.id;

    if (userId) {
      // Small delay to ensure user row is available in the auth.users table
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('ℹ️  Profile does not exist yet, attempting to create...');

          // Try to create profile
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const profileData = {
              id: userId,
              full_name: userData.user.user_metadata?.full_name || 'Test Customer',
              phone: userData.user.user_metadata?.phone || '+971501234567',
              role: userData.user.user_metadata?.user_type || 'customer',
              email_verified: userData.user.email_confirmed_at ? true : false
            };

            const { error: createError } = await supabase
              .from('profiles')
              .insert(profileData);

            if (createError) {
              console.error('❌ Profile creation failed:', createError.message);
              // Try using service role key if available (server-side insert)
              const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
              if (supabaseServiceKey) {
                const { createClient } = require('@supabase/supabase-js')
                const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey)
                const { error: serviceError, data: serviceData } = await serviceSupabase
                  .from('profiles')
                  .insert(profileData)
                  .select()
                if (serviceError) {
                  console.error('❌ Service profile creation failed:', serviceError.message)
                } else {
                  console.log('✅ Service profile created successfully')
                  console.log('   Profile ID:', serviceData?.[0]?.id)
                }
              }
            } else {
              console.log('✅ Profile created successfully');

              // Verify profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

              if (newProfile) {
                console.log('✅ Profile verified:', {
                  id: newProfile.id,
                  full_name: newProfile.full_name,
                  role: newProfile.role,
                  email_verified: newProfile.email_verified
                });
              }
            }
          }
        } else {
          console.error('❌ Profile access error:', profileError.message);
        }
      } else {
        console.log('✅ Profile exists:', {
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
          email_verified: profile.email_verified
        });
      }
    }
    console.log();

    // 4. Test Signout
    console.log('4️⃣  Testing Signout...');
    const { error: signoutError } = await supabase.auth.signOut();

    if (signoutError) {
      console.error('❌ Signout failed:', signoutError.message);
    } else {
      console.log('✅ Signout successful');
    }

    console.log();
    console.log('🎉 Customer Authentication Test Complete!');
    console.log('========================================');

  } catch (err) {
    console.error('❌ Unexpected test error:', err);
  }
}

testCustomerAuth();