import dns from 'node:dns'
import dotenv from 'dotenv'
import { Client } from 'pg'

dns.setDefaultResultOrder('ipv4first')
dotenv.config()

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    console.error('DATABASE_URL/SUPABASE_DB_URL não configurado no .env')
    process.exit(1)
  }
  console.log('Conectando ao banco...')
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    const ver = await client.query('SELECT version()')
    const now = await client.query('SELECT NOW()')
    console.log('Versão:', ver.rows[0].version)
    console.log('NOW():', now.rows[0].now)
  } catch (err) {
    console.error('Falha na conexão:', err)
    process.exit(1)
  } finally {
    await client.end().catch(() => {})
  }
}

main()
