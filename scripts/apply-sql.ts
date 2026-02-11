import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config()

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL
  console.log('Using DB URL:', dbUrl)
  if (!dbUrl) {
    console.error('Faltando SUPABASE_DB_URL/DATABASE_URL no .env')
    process.exit(1)
  }

  const sqlFile = path.resolve('supabase/migrations/20251209_add_product_extras.sql')
  const sql = await fs.readFile(sqlFile, 'utf8')

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migração aplicada com sucesso')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Erro ao aplicar migração:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
