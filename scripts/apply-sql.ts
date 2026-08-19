import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config()

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    console.error('Faltando SUPABASE_DB_URL/DATABASE_URL no .env')
    process.exit(1)
  }

  const requestedFiles = process.argv.slice(2)
  const migrationDir = path.resolve('supabase/migrations')
  if (!requestedFiles.length) throw new Error('Informe ao menos um arquivo de migração.')
  const files = requestedFiles

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS public.schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )`)
    const applied = await client.query<{ filename: string }>('SELECT filename FROM public.schema_migrations')
    const appliedFiles = new Set(applied.rows.map(row => row.filename))

    for (const filename of files) {
      if (appliedFiles.has(filename)) {
        console.log(`Ignorada (já aplicada): ${filename}`)
        continue
      }
      const sql = await fs.readFile(path.join(migrationDir, filename), 'utf8')
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO public.schema_migrations (filename) VALUES ($1)', [filename])
        await client.query('COMMIT')
        console.log(`Aplicada: ${filename}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }
  } catch (err) {
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
