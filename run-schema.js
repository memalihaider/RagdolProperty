const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runSQL() {
  try {
    const sqlPath = path.join(__dirname, 'new-features-schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('Executing SQL schema...')

    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('Error executing SQL:', error)
      process.exit(1)
    }

    console.log('SQL schema executed successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

runSQL()