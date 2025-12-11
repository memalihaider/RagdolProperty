#!/usr/bin/env node
/**
 * Simple sign-out verification script using Supabase JS client.
 * Usage:
 * SUPABASE_URL=... SUPABASE_ANON_KEY=... TEST_EMAIL=... TEST_PASSWORD=... node scripts/test-signout.js
 */
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const email = process.env.TEST_EMAIL
const password = process.env.TEST_PASSWORD

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}
if (!email || !password) {
  console.error('Please set TEST_EMAIL and TEST_PASSWORD environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  try {
    console.log('Signing in...')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Sign-in failed:', error.message || error)
      process.exit(2)
    }
    console.log('Signed in, session:', !!data.session)

    const sessionBefore = await supabase.auth.getSession()
    console.log('Session exists before signOut: ', !!sessionBefore.data.session)

    console.log('Signing out...')
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.warn('Sign-out returned error:', signOutError.message || signOutError)
    }

    const sessionAfter = await supabase.auth.getSession()
    console.log('Session exists after signOut:', !!sessionAfter.data.session)
    if (sessionAfter.data.session) process.exit(3)
    else process.exit(0)
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(4)
  }
}

run()
