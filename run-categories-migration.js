const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

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

async function runCategoriesMigration() {
  try {
    console.log('Please run the following SQL in your Supabase SQL Editor:')
    console.log('==========================================================')

    const sqlPath = path.join(__dirname, 'supabase/migrations/20251212140000_add_categories_table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log(sql)
    console.log('==========================================================')
    console.log('Or run: node -e "console.log(\'' + sql.replace(/'/g, '\\\'').replace(/\n/g, '\\n') + '\')" > categories.sql')

  } catch (error) {
    console.error('Error:', error)
  }
}

runCategoriesMigration()