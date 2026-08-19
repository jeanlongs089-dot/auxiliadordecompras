import { useMemo, useState } from 'react'
import { Apple, Beef, Check, ChevronRight, CircleParking, Coffee, Croissant, Fish, LocateFixed, MapPin, Milk, Navigation, Search, ShoppingBasket, Sparkles, UtensilsCrossed, X } from 'lucide-react'
import { useStore } from '@/contexts/StoreContext'
import { trackIntent } from '@/lib/analytics'

const zones = [
  {id:'hortifruti',name:'Hortifruti',subtitle:'Frutas, legumes e verduras',aisle:'Praça de frescos',tone:'green',icon:Apple,products:['Banana prata','Maçã gala','Tomate italiano','Alface crespa']},
  {id:'padaria',name:'Padaria',subtitle:'Pães e confeitaria',aisle:'Parede norte',tone:'sand',icon:Croissant,products:['Pão francês','Pão de queijo','Bolo de cenoura','Croissant']},
  {id:'acougue',name:'Açougue',subtitle:'Carnes e aves',aisle:'Balcão norte',tone:'rose',icon:Beef,products:['Patinho bovino','Peito de frango','Linguiça toscana']},
  {id:'mercearia',name:'Mercearia',subtitle:'Itens essenciais',aisle:'Corredores 01–04',tone:'yellow',icon:ShoppingBasket,products:['Arroz integral','Feijão carioca','Macarrão','Azeite']},
  {id:'bebidas',name:'Bebidas',subtitle:'Águas, sucos e refrescos',aisle:'Corredores 05–06',tone:'blue',icon:Coffee,products:['Água mineral','Suco de laranja','Refrigerante']},
  {id:'laticinios',name:'Laticínios',subtitle:'Frios e refrigerados',aisle:'Parede leste',tone:'cyan',icon:Milk,products:['Leite integral','Queijo minas','Iogurte natural','Manteiga']},
  {id:'congelados',name:'Congelados',subtitle:'Praticidade para o dia a dia',aisle:'Ilhas centrais',tone:'violet',icon:Fish,products:['Pizza congelada','Peixe','Legumes congelados']},
  {id:'limpeza',name:'Limpeza',subtitle:'Casa e cuidados',aisle:'Corredores 07–09',tone:'lime',icon:Sparkles,products:['Detergente','Sabão em pó','Desinfetante']},
  {id:'cafeteria',name:'Cafeteria',subtitle:'Uma pausa gostosa',aisle:'Canto nordeste',tone:'coffee',icon:Coffee,products:['Café espresso','Capuccino','Sanduíche natural']},
]
const aisles=[
  {n:'01',zone:'mercearia',labels:['Arroz','Feijão']},{n:'02',zone:'mercearia',labels:['Massas','Molhos']},{n:'03',zone:'mercearia',labels:['Farinhas','Óleos']},{n:'04',zone:'mercearia',labels:['Cereais','Matinais']},
  {n:'05',zone:'bebidas',labels:['Sucos','Águas']},{n:'06',zone:'bebidas',labels:['Refrigerantes','Cervejas']},{n:'07',zone:'limpeza',labels:['Lavanderia','Limpeza']},{n:'08',zone:'limpeza',labels:['Higiene','Papel']},{n:'09',zone:'limpeza',labels:['Pet','Utilidades']},
]

export default function StoreMap(){
  const {activeStore}=useStore();const [query,setQuery]=useState('');const [selectedId,setSelectedId]=useState('mercearia');const [categoryId,setCategoryId]=useState('all');const [route,setRoute]=useState(false);const [error,setError]=useState(false)
  const selected=useMemo(()=>zones.find(z=>z.id===selectedId)!,[selectedId]);const Icon=selected.icon
  const results=useMemo(()=>{const term=query.trim().toLocaleLowerCase('pt-BR');return zones.filter(z=>categoryId==='all'||z.id===categoryId).flatMap(z=>z.products.filter(p=>!term||p.toLocaleLowerCase('pt-BR').includes(term)).map(product=>({product,zone:z}))).slice(0,8)},[query,categoryId])
  const choose=(id:string)=>{setSelectedId(id);setCategoryId(id);setRoute(false);setError(false)}
  const chooseCategory=(id:string)=>{setCategoryId(id);setError(false);if(id!=='all')setSelectedId(id)}
  const locate=(value=query)=>{const term=value.trim().toLocaleLowerCase('pt-BR');if(!term)return;const match=zones.find(z=>z.name.toLocaleLowerCase('pt-BR').includes(term)||z.products.some(p=>p.toLocaleLowerCase('pt-BR').includes(term)));if(!match){setError(true);setRoute(false);return}setSelectedId(match.id);setQuery(value);setError(false);setRoute(true);void trackIntent('location_viewed',activeStore?.id||null,{term:value,department_id:match.id})}
  return <div className="store-map-shell">
    <header className="map-hero"><div><span className="map-kicker"><LocateFixed size={14}/> MAPA INTERATIVO DA LOJA</span><h1>Sua compra,<br/><em>no melhor caminho.</em></h1><p>Uma planta real do supermercado para encontrar cada produto, corredor e serviço sem perder tempo.</p></div><div className="store-status"><span className="status-dot"/><div><small>UNIDADE SELECIONADA</small><strong>{activeStore?.name||'Mercado Central · Loja 01'}</strong></div><ChevronRight size={18}/></div></header>
    <section className="map-search-card category-search">
      <div className="map-search-field"><Search size={21}/><input value={query} onChange={e=>{setQuery(e.target.value);setError(false)}} onKeyDown={e=>e.key==='Enter'&&locate()} placeholder="Digite um produto: arroz, leite, detergente..." aria-label="Buscar produto"/>{query&&<button onClick={()=>{setQuery('');setError(false)}} aria-label="Limpar"><X size={16}/></button>}</div><button className="locate-button" onClick={()=>locate()}><Navigation size={17}/> Localizar</button>
      <div className="category-browser"><div className="category-browser-head"><div><span>BUSCAR POR CATEGORIA</span><strong>Escolha um setor para filtrar os produtos</strong></div><small>{categoryId==='all'?'35 produtos de exemplo':`${zones.find(z=>z.id===categoryId)?.products.length||0} produtos neste setor`}</small></div><div className="category-chips"><button className={categoryId==='all'?'active':''} onClick={()=>chooseCategory('all')}><ShoppingBasket size={16}/><span><b>Todas</b><small>Ver tudo</small></span></button>{zones.map(z=>{const CategoryIcon=z.icon;return <button key={z.id} className={`${categoryId===z.id?'active':''} tone-chip-${z.tone}`} onClick={()=>chooseCategory(z.id)}><CategoryIcon size={16}/><span><b>{z.name}</b><small>{z.products.length} itens</small></span></button>})}</div></div>
      {(query||categoryId!=='all')&&<div className="product-suggestions"><div className="suggestion-head"><span>{query?`RESULTADOS PARA “${query}”`:'PRODUTOS DA CATEGORIA'}</span><small>{results.length} encontrado{results.length===1?'':'s'}</small></div>{results.length>0?<div className="suggestion-grid">{results.map(({product,zone})=><button key={`${zone.id}-${product}`} onClick={()=>locate(product)}><span className={`suggestion-icon tone-${zone.tone}`}><zone.icon size={15}/></span><span><b>{product}</b><small>{zone.name} · {zone.aisle}</small></span><MapPin size={15}/></button>)}</div>:<div className="empty-suggestion"><Search size={18}/><span>Nenhum produto nesta categoria. Tente outro termo.</span></div>}</div>}
      {error&&<p className="map-search-error">Produto não encontrado. Escolha uma categoria ou tente outro nome.</p>}
    </section>
    <section className="map-workspace"><div className="map-stage"><div className="map-stage-head"><div><span>PLANTA · TÉRREO</span><strong>Selecione uma gôndola ou setor</strong></div><div className="map-legend"><i/> Sua posição <b/> Rota sugerida</div></div>
      <div className="store-floor real-floor">
        <div className="floor-grid"/>
        <button className={`wall-zone wall-north bakery ${selectedId==='padaria'?'selected':''}`} onClick={()=>choose('padaria')}><Croissant size={15}/><b>PADARIA</b><small>Pães · Bolos · Confeitaria</small></button>
        <button className={`wall-zone wall-north butcher ${selectedId==='acougue'?'selected':''}`} onClick={()=>choose('acougue')}><Beef size={15}/><b>AÇOUGUE</b><small>Carnes · Aves</small></button>
        <button className={`wall-zone wall-north cafe ${selectedId==='cafeteria'?'selected':''}`} onClick={()=>choose('cafeteria')}><Coffee size={15}/><b>CAFETERIA</b></button>
        <button className={`wall-zone dairy-wall ${selectedId==='laticinios'?'selected':''}`} onClick={()=>choose('laticinios')}><Milk size={15}/><b>LATICÍNIOS & FRIOS</b></button>
        <div className="aisle-field">{aisles.map(a=><button key={a.n} className={`shelf shelf-${a.zone} ${selectedId===a.zone?'selected':''}`} onClick={()=>choose(a.zone)}><span className="aisle-number">{a.n}</span><div><i/><small>{a.labels[0]}</small><i/><small>{a.labels[1]}</small><i/></div></button>)}</div>
        <button className={`fresh-plaza ${selectedId==='hortifruti'?'selected':''}`} onClick={()=>choose('hortifruti')}><span><Apple size={17}/><b>HORTIFRUTI</b><small>Praça de frescos</small></span><div>{[1,2,3,4,5].map(n=><i key={n}/>)}</div></button>
        <button className={`frozen-island ${selectedId==='congelados'?'selected':''}`} onClick={()=>choose('congelados')}><Fish size={14}/><b>CONGELADOS</b></button>
        <div className="service-strip"><span>ATENDIMENTO</span><span>RETIRADA</span><span>FARMÁCIA</span></div>
        {route&&<div className="route-path"><i/><i/><i/><i/><i/></div>}
        <div className="checkout-row"><span>FRENTE DE CAIXA</span>{[1,2,3,4,5,6,7,8].map(n=><i key={n}>{n}</i>)}</div><div className="you-are-here"><MapPin size={15} fill="currentColor"/><span>VOCÊ ESTÁ AQUI</span></div><div className="entrance">ENTRADA PRINCIPAL ↑</div>
      </div></div>
      <aside className="map-detail-panel"><div className={`detail-icon tone-${selected.tone}`}><Icon size={28}/></div><span className="detail-kicker">{selected.aisle}</span><h2>{selected.name}</h2><p>{selected.subtitle}. Veja alguns dos produtos e trace uma rota desde a entrada.</p><div className="detail-location"><MapPin size={18}/><div><small>LOCALIZAÇÃO EXATA</small><strong>{selected.aisle}</strong></div></div><div className="detail-products"><span>PRODUTOS NESTE SETOR</span>{selected.products.map(p=><button key={p} onClick={()=>locate(p)}><UtensilsCrossed size={14}/>{p}<ChevronRight size={14}/></button>)}</div><button className={`route-button ${route?'active':''}`} onClick={()=>setRoute(v=>!v)}>{route?<Check size={18}/>:<Navigation size={18}/>} {route?'Rota ativa · 2 min':'Traçar rota até aqui'}</button></aside>
    </section><footer className="map-footer-tip"><CircleParking size={21}/><div><strong>Compra inteligente</strong><span>Siga a rota sugerida e deixe os refrigerados para o final.</span></div></footer>
  </div>
}
