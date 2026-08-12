import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Barcode, Camera, Check, ChevronDown, CircleHelp, Flashlight, ImagePlus, Minus, Plus, ScanLine, ShoppingBasket, Tag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

type ScanMode = 'price' | 'barcode'
type CartItem = { id: number; name: string; detail: string; price: number; quantity: number }
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Scanner() {
  const [mode, setMode] = useState<ScanMode>('price')
  const [cameraOn, setCameraOn] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: 'Leite integral', detail: 'Italac • 1 L', price: 5.49, quantity: 2 },
    { id: 2, name: 'Banana prata', detail: 'Hortifruti • 1 kg', price: 6.89, quantity: 1 },
  ])
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      streamRef.current = stream; setCameraOn(true)
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream })
    } catch { toast.error('Não foi possível acessar a câmera. Use o modo demonstração.') }
  }
  const closeCamera = () => { streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; setCameraOn(false) }
  const changeMode = (next: ScanMode) => { setMode(next); setScanned(false); setQuantity(1) }
  const product = mode === 'price'
    ? { name: 'Café torrado e moído', detail: 'Melitta • 500 g', price: 18.9, code: 'Preço reconhecido na etiqueta' }
    : { name: 'Arroz tipo 1', detail: 'Camil • 5 kg', price: 29.99, code: 'EAN 7896006711128' }
  const simulateScan = () => { setScanned(true); toast.success(mode === 'price' ? 'Preço reconhecido!' : 'Produto encontrado!') }
  const addItem = () => {
    setItems(current => [...current, { id: Date.now(), name: product.name, detail: product.detail, price: product.price, quantity }])
    toast.success(`${quantity} ${quantity === 1 ? 'item adicionado' : 'itens adicionados'} à lista`); setScanned(false); setQuantity(1)
  }
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return <div className="scanner-shell">
    <header className="scanner-header">
      <Link to="/listas" className="scanner-icon-button" aria-label="Voltar"><ArrowLeft size={20} /></Link>
      <div className="scanner-heading"><span>MINHA LISTA</span><button>Compras da semana <ChevronDown size={15} /></button></div>
      <button className="scanner-icon-button" aria-label="Ajuda"><CircleHelp size={20} /></button>
    </header>
    <main className="scanner-content">
      <section className="scanner-intro">
        <div><span className="scanner-step">01</span><span className="scanner-kicker">ADICIONAR PRODUTO</span></div>
        <h1>Escaneie.<br /><em>Adicione.</em> Pronto.</h1>
        <p>Aponte a câmera para a etiqueta de preço ou para o código de barras do produto.</p>
      </section>
      <div className="scanner-mode-switch" role="tablist" aria-label="Modo de leitura">
        <button className={mode === 'price' ? 'active' : ''} onClick={() => changeMode('price')}><Tag size={18} /><span><b>Etiqueta de preço</b><small>Qualquer supermercado</small></span></button>
        <button className={mode === 'barcode' ? 'active' : ''} onClick={() => changeMode('barcode')}><Barcode size={20} /><span><b>Código de barras</b><small>Loja conectada</small></span></button>
      </div>
      <section className="scanner-workspace">
        <div className="camera-panel">
          {cameraOn ? <video ref={videoRef} autoPlay playsInline muted /> : <div className="camera-empty"><Camera size={32} /><b>Câmera pronta para escanear</b><span>Centralize a {mode === 'price' ? 'etiqueta de preço' : 'embalagem'} no quadro</span></div>}
          <div className="scan-frame"><i /><i /><i /><i /><div className="scan-beam" /></div>
          <div className="camera-top"><span><i /> AO VIVO</span><button aria-label="Fechar câmera" onClick={closeCamera}><X size={18} /></button></div>
          <button className="flash-button" aria-label="Ativar flash"><Flashlight size={18} /></button>
          <div className="camera-actions"><button className="gallery-button" aria-label="Escolher foto"><ImagePlus size={20} /></button><button className="capture-button" onClick={cameraOn ? simulateScan : startCamera}><span>{cameraOn ? <ScanLine size={26} /> : <Camera size={26} />}</span></button><button className="demo-button" onClick={simulateScan}>TESTAR</button></div>
        </div>
        <div className="scan-side">
          {!scanned ? <div className="scan-guide">
            <span className="guide-icon">{mode === 'price' ? <Tag size={22} /> : <Barcode size={24} />}</span><span className="scanner-kicker">COMO FUNCIONA</span>
            <h2>{mode === 'price' ? 'Enquadre o preço da etiqueta' : 'Aponte para o código do produto'}</h2>
            <p>{mode === 'price' ? 'Nossa leitura identifica o valor. Depois, você confirma o produto e escolhe a quantidade.' : 'O produto e o preço aparecem automaticamente quando o supermercado está conectado.'}</p>
            <div className="guide-tip"><Check size={15} /> Mantenha a câmera firme e evite reflexos</div>
          </div> : <div className="scan-result">
            <div className="result-status"><Check size={15} /> {mode === 'price' ? 'PREÇO IDENTIFICADO' : 'PRODUTO ENCONTRADO'}</div>
            <div className="product-thumb">{mode === 'price' ? 'CAFÉ' : 'ARROZ'}<small>{mode === 'price' ? '500 g' : '5 kg'}</small></div>
            <div className="product-copy"><span>{product.code}</span><h2>{product.name}</h2><p>{product.detail}</p><strong>{money.format(product.price)}</strong><small>preço por unidade</small></div>
            <div className="quantity-row"><span>Quantidade</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button></div></div>
            <button className="add-button" onClick={addItem}><Plus size={18} /> Adicionar à lista <span>{money.format(product.price * quantity)}</span></button>
            <button className="scan-again" onClick={() => setScanned(false)}>Escanear novamente</button>
          </div>}
        </div>
      </section>
      <section className="mini-cart">
        <div className="mini-cart-title"><span><ShoppingBasket size={19} /> SUA LISTA AGORA</span><b>{totalUnits} itens</b></div>
        <div className="mini-cart-items">{items.slice(-3).map(item => <div key={item.id}><span>{item.quantity}×</span><p><b>{item.name}</b><small>{item.detail}</small></p><strong>{money.format(item.price * item.quantity)}</strong><button onClick={() => setItems(items.filter(i => i.id !== item.id))} aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button></div>)}</div>
        <div className="mini-cart-total"><span>Total estimado<small>Os preços podem variar no caixa</small></span><strong>{money.format(total)}</strong></div>
      </section>
    </main>
  </div>
}
