#!/usr/bin/env node

/**
 * Test Email System
 */

import { sendInquiryConfirmation, sendValuationConfirmation, sendQuestionConfirmation, sendAdminNotification } from './lib/email.ts';

async function testEmailSystem() {
  console.log('📧 Testing Email System');
  console.log('=======================');

  try {
    console.log('\n1. Testing Inquiry Confirmation...');
    const inquiryResult = await sendInquiryConfirmation('test@example.com', 'John Doe', 'Beautiful Apartment', '123 Main St, Dubai');
    console.log('✅ Inquiry email sent successfully');

    console.log('\n2. Testing Valuation Confirmation...');
    const valuationResult = await sendValuationConfirmation('test@example.com', 'Jane Smith', 'Apartment', 'Downtown Dubai');
    console.log('✅ Valuation email sent successfully');

    console.log('\n3. Testing Question Confirmation...');
    const questionResult = await sendQuestionConfirmation('test@example.com', 'Bob Johnson', 'How much is the property?');
    console.log('✅ Question email sent successfully');

    console.log('\n4. Testing Admin Notification...');
    const adminResult = await sendAdminNotification('admin@ragdol.com', 'inquiry', {
      name: 'John Doe',
      email: 'test@example.com',
      propertyTitle: 'Beautiful Apartment',
      propertyAddress: '123 Main St, Dubai'
    });
    console.log('✅ Admin notification sent successfully');

    console.log('\n✨ Email System Testing Complete!');
    console.log('All emails sent successfully (check your SendGrid dashboard)');

  } catch (error: any) {
    console.log(`❌ Email test failed: ${error.message}`);
  }
}

// Run the test
testEmailSystem().catch(console.error);