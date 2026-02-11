import { useEffect, useRef, useState, useCallback } from 'react'
import Quagga from '@ericblade/quagga2'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description?: string
  price?: number
  unit?: string
  category?: string
  department_id?: string
  image_url?: string
  in_stock?: boolean
  barcode?: string
  valid_until?: string | null
  allergens?: string[] | null
}

export default function Experience() {
  const scannerRef = useRef<HTMLDivElement | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastCode, setLastCode] = useState<string>('')
  const lastCodeRef = useRef<string>('')
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>('')
  const isSecure = typeof window !== 'undefined' && (window.isSecureContext || ['localhost','127.0.0.1'].includes(window.location.hostname))
  const [scanStatus, setScanStatus] = useState<string>('')

  const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '—'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  }

  const stopScanner = useCallback(() => {
    Quagga.stop()
    setIsScanning(false)
  }, [])

  const startScanner = useCallback(async () => {
    setError('')
    setProduct(null)
    setLastCode('')
    try {
      try { Quagga.stop() } catch {}
      const target = scannerRef.current as HTMLDivElement
      if (!target) {
        setError('Falha ao iniciar o leitor')
        return
      }
      const devices = await navigator.mediaDevices?.enumerateDevices?.()
      if (!devices || !devices.some(d => d.kind === 'videoinput')) {
        setError('Nenhuma câmera encontrada no dispositivo')
        return
      }
      const rect = target.getBoundingClientRect()
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      await Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target,
          constraints: {
            facingMode: { ideal: 'environment' },
            width: { ideal: Math.max(320, Math.floor(rect.width) || 640) },
            height: { ideal: Math.max(240, Math.floor(rect.height) || 480) }
          },
          area: { top: '0%', right: '0%', left: '0%', bottom: '0%' }
        },
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'code_128_reader',
            'upc_reader',
            'upc_e_reader',
          ],
        },
        locate: true,
        numOfWorkers: 0,
      })
      Quagga.start()
      setIsScanning(true)
    } catch (e: any) {
      const msg = e?.name === 'NotAllowedError' ? 'Permissão de câmera negada' : (e?.message || 'Não foi possível iniciar a câmera. Verifique permissões e contexto seguro (https).')
      setError(msg)
    }
  }, [])

  useEffect(() => {
    const onDetected = async (result: any) => {
      const code = result?.codeResult?.code
      if (!code || code === lastCodeRef.current) return
      lastCodeRef.current = code
      setLastCode(code)
      setScanStatus('detectado')
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('barcode', code)
          .limit(1)

        if (dbError) {
          setError("Campo 'barcode' não encontrado na tabela de produtos. Configure o banco.")
          stopScanner()
          return
        }

        const found = data?.[0]
        if (!found) {
          setError('')
          setProduct(null)
          return
        }
        setProduct(found as Product)
        stopScanner()
      } catch (e) {
        setError('Erro ao buscar produto')
      }
    }

    Quagga.onDetected(onDetected)
    Quagga.onProcessed((result: any) => {
      if (!result) return
      if (result.boxes && result.boxes.length > 0) {
        setScanStatus('analisando...')
      }
      if (result.codeResult && result.codeResult.code) {
        setScanStatus('detectando...')
      }
    })
    return () => {
      Quagga.offDetected(onDetected)
      try { Quagga.stop() } catch {}
    }
  }, [stopScanner])

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Experiência de Compra</h1>
      <p className="text-gray-600 mb-6">Leia o código de barras para ver informações do produto</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leitor de Código de Barras</h2>
            {isScanning ? (
              <button onClick={stopScanner} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Parar</button>
            ) : (
              <button onClick={startScanner} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Iniciar</button>
            )}
          </div>
          {!isSecure && (
            <div className="mb-3 text-sm text-amber-700 bg-amber-100 px-3 py-2 rounded">
              Para abrir a câmera no celular, acesse via HTTPS ou localhost.
            </div>
          )}
          <div ref={scannerRef} className="w-full h-72 bg-gray-100 rounded-lg overflow-hidden" />
          {scanStatus && (
            <div className="mt-2 text-xs text-gray-500">{scanStatus}</div>
          )}
          {lastCode && (
            <div className="mt-3 text-sm text-gray-600">Último código: {lastCode}</div>
          )}
          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Produto</h2>
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium">Código:</span>
            <span>{lastCode || '—'}</span>
          </div>
          {product ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary-700">{product.name || 'sem dados'}</div>
              <div className="text-gray-700">{product.description || 'sem dados'}</div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Preço:</span>
                <span>{typeof product.price === 'number' ? formatPrice(product.price) : 'sem dados'}</span>
                {product.unit && <span className="text-sm text-gray-500">/{product.unit}</span>}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Validade:</span>
                <span>{product.valid_until || 'sem dados'}</span>
              </div>
              <div>
                <span className="font-medium">Alergênicos:</span>
                <div className="mt-1 text-gray-700 text-sm">
                  {product.allergens && product.allergens.length > 0 ? product.allergens.join(', ') : 'sem dados'}
                </div>
              </div>
            </div>
          ) : lastCode ? (
            <div className="space-y-2 text-gray-700">
              <div className="text-2xl font-bold text-primary-700">sem dados</div>
              <div>sem dados</div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Preço:</span>
                <span>sem dados</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Validade:</span>
                <span>sem dados</span>
              </div>
              <div>
                <span className="font-medium">Alergênicos:</span>
                <div className="mt-1 text-gray-700 text-sm">sem dados</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Nenhum produto carregado</div>
          )}
        </div>
      </div>
    </div>
  )
}
