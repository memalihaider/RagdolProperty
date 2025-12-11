#!/usr/bin/env node

/**
 * Test API Endpoints
 */

async function testAPI() {
  console.log('🔗 Testing API Endpoints');
  console.log('========================');

  const baseUrl = 'http://localhost:3000';

  const endpoints = [
    '/api/admin/agents',
    '/api/admin/properties',
    '/api/properties',
    '/api/enquiries',
    '/api/valuations',
    '/api/questions'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`);

      const response = await fetch(`${baseUrl}${endpoint}`);
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          console.log(`✅ ${endpoint}: ${data.length} items`);
        } else if (data.agents) {
          console.log(`✅ ${endpoint}: ${data.agents.length} agents`);
        } else if (data.properties) {
          console.log(`✅ ${endpoint}: ${data.properties.length} properties`);
        } else if (data.enquiries) {
          console.log(`✅ ${endpoint}: ${data.enquiries.length} enquiries`);
        } else if (data.valuations) {
          console.log(`✅ ${endpoint}: ${data.valuations.length} valuations`);
        } else if (data.questions) {
          console.log(`✅ ${endpoint}: ${data.questions.length} questions`);
        } else {
          console.log(`✅ ${endpoint}: OK (${JSON.stringify(data).substring(0, 100)}...)`);
        }
      } else {
        console.log(`❌ ${endpoint}: ${response.status} - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }

  console.log('\n✨ API Testing Complete!');
}

// Run the test
testAPI().catch(console.error);