#!/usr/bin/env node

/**
 * Comprehensive App Testing Script
 * Tests authentication, properties, and all features
 */

const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtkkhtjervcgpjsdjgti.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0a2todGplcnZjZ3Bqc2RqZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzE5NzYsImV4cCI6MjA4MDcwNzk3Nn0.5ie2twrYMW_8ZIVcYooM_WayXiPy7K1NaPIEyqL3sDc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAuthentication() {
  console.log('🔐 Testing Authentication System');
  console.log('================================');

  // Test admin login
  console.log('\n1. Testing Admin Login...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@ragdol.com',
      password: 'Admin123!'
    });

    if (error) {
      console.log(`❌ Admin login failed: ${error.message}`);
    } else {
      console.log(`✅ Admin login successful: ${data.user?.email}`);

      // Test profile fetch
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.log(`❌ Profile fetch failed: ${profileError.message}`);
      } else {
        console.log(`✅ Profile fetched: ${profile?.full_name} (${profile?.role})`);
      }

      await supabase.auth.signOut();
    }
  } catch (err) {
    console.log(`❌ Admin login error: ${err.message}`);
  }

  // Test customer signup
  console.log('\n2. Testing Customer Signup...');
  try {
    const testEmail = `test${Date.now()}@ragdol.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'Test123!',
      options: {
        data: {
          full_name: 'Test User',
          phone: '+971501234567'
        }
      }
    });

    if (error) {
      console.log(`❌ Customer signup failed: ${error.message}`);
    } else {
      console.log(`✅ Customer signup successful: ${data.user?.email}`);
    }
  } catch (err) {
    console.log(`❌ Customer signup error: ${err.message}`);
  }
}

async function testProperties() {
  console.log('\n🏠 Testing Properties System');
  console.log('============================');

  try {
    // Test properties count
    const { data: properties, error, count } = await adminSupabase
      .from('properties')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.log(`❌ Properties fetch failed: ${error.message}`);
    } else {
      console.log(`✅ Found ${count} properties in database`);
      console.log(`📊 Sample properties:`);
      properties?.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.title} - ${prop.price} AED (${prop.status})`);
      });
    }

    // Test published properties
    const { data: publishedProps, error: pubError } = await adminSupabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('published', true);

    if (pubError) {
      console.log(`❌ Published properties fetch failed: ${pubError.message}`);
    } else {
      console.log(`✅ Found ${publishedProps?.length || 0} published properties`);
    }

    // Test featured properties
    const { data: featuredProps, error: featError } = await adminSupabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('featured', true)
      .eq('published', true);

    if (featError) {
      console.log(`❌ Featured properties fetch failed: ${featError.message}`);
    } else {
      console.log(`✅ Found ${featuredProps?.length || 0} featured properties`);
    }

  } catch (err) {
    console.log(`❌ Properties test error: ${err.message}`);
  }
}

async function testCustomerFeatures() {
  console.log('\n👥 Testing Customer Features');
  console.log('============================');

  try {
    // Test customer questions table
    const { data: questions, error: qError } = await adminSupabase
      .from('customer_questions')
      .select('*', { count: 'exact' });

    if (qError) {
      console.log(`❌ Customer questions table check failed: ${qError.message}`);
    } else {
      console.log(`✅ Customer questions table exists (${questions?.length || 0} records)`);
    }

    // Test property valuations table
    const { data: valuations, error: vError } = await adminSupabase
      .from('property_valuations')
      .select('*', { count: 'exact' });

    if (vError) {
      console.log(`❌ Property valuations table check failed: ${vError.message}`);
    } else {
      console.log(`✅ Property valuations table exists (${valuations?.length || 0} records)`);
    }

  } catch (err) {
    console.log(`❌ Customer features test error: ${err.message}`);
  }
}

async function testAPIEndpoints() {
  console.log('\n🔗 Testing API Endpoints');
  console.log('========================');

  try {
    // Test properties API
    const response = await fetch('http://localhost:3000/api/properties?limit=5');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Properties API working (${data.length} properties returned)`);
    } else {
      console.log(`❌ Properties API failed: ${response.status}`);
    }
  } catch (err) {
    console.log(`❌ API test error: ${err.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive App Testing');
  console.log('=====================================');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  await testAuthentication();
  await testProperties();
  await testCustomerFeatures();
  await testAPIEndpoints();

  console.log('\n✨ Testing Complete!');
  console.log('===================');
}

runAllTests().catch(console.error);