import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

async function main() {
  const url = process.env.VITE_SUPABASE_URL || ''
  const key = process.env.VITE_SUPABASE_ANON_KEY || ''
  if (!url || !key) {
    console.error('Faltam VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY no .env')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from('products')
    .select('id,name')
    .limit(1)

  if (error) {
    console.error('Erro Supabase:', error.message)
    process.exit(1)
  }
  console.log('Conexão OK. Exemplo de produto:', data)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
