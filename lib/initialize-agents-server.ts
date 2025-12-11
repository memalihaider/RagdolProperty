'use server';

import { createClient } from '@/lib/supabase-server';

export async function initializeAgents() {
  if (typeof window !== 'undefined') {
    return; // Don't run on client
  }

  try {
    console.log('[Init Agents] Starting initialization...');
    
    const supabase = await createClient();
    
    // Check if agents already exist
    const { data: existingAgents, error: checkError } = await supabase
      .from('agents')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('[Init Agents] Error checking agents:', checkError.message);
      return;
    }
    
    if (existingAgents && existingAgents.length > 0) {
      console.log('[Init Agents] Database already has agents, skipping auto-initialization');
      return;
    }
    
    console.log('[Init Agents] No agents found. Admin portal should be used to add agents.');
    return;
  } catch (error: any) {
    console.error('[Init Agents] Exception:', error.message);
    return;
  }
}

// Initialize on import
initializeAgents().catch(console.error);
