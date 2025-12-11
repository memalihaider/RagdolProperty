const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE service role or URL in environment')
  process.exit(1)
}

const serviceSupabase = createClient(supabaseUrl, serviceKey)

;(async function () {
  try {
    // Check we can access admin list users
    const { data: users, error: listErr } = await serviceSupabase.auth.admin.listUsers()
    if (listErr) {
      console.error('Service key does not have admin access or failed listUsers:', listErr)
      process.exit(1)
    }
    console.log('✅ Service role listUsers OK; found', users?.length || 0, 'users')

    // Create a temporary test user via admin
    const testEmail = `service-test-${Date.now()}@example.com`
    const { data: userData, error: createUserErr } = await serviceSupabase.auth.admin.createUser({
      email: testEmail,
      password: 'ServiceTest123!'
    })
    if (createUserErr) {
      console.error('Failed to create test user:', createUserErr)
      process.exit(1)
    }
    const userId = userData.user.id
    console.log('✅ Created test user with id', userId)

    // Try to insert into profiles with service role
    const profileData = {
      id: userId,
      full_name: 'Service Test',
      phone: '+971501234567',
      role: 'customer',
      email_verified: true
    }
    const { data: profileInsert, error: profileErr } = await serviceSupabase.from('profiles').insert(profileData).select()
    if (profileErr) {
      console.error('❌ Service profile creation failed:', profileErr)
    } else {
      console.log('✅ Service profile creation successful:', profileInsert?.[0])
    }

    // Cleanup
    const { error: deleteErr } = await serviceSupabase.auth.admin.deleteUser(userId)
    if (deleteErr) {
      console.error('Cleanup failed to delete test user:', deleteErr)
    } else {
      console.log('Cleanup deleted test user')
    }

  } catch (err) {
    console.error('Unexpected error during service profile test:', err)
  }
})()
