import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Auxiliador de Compras</h1>
      <p className="text-gray-600 mb-6">Selecione uma opção para começar</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/produtos" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Catálogo de Produtos</h2>
          <p className="text-gray-600">Veja preços e detalhes dos produtos</p>
        </Link>

        <Link to="/mapa" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mapa da Loja</h2>
          <p className="text-gray-600">Encontre departamentos e localizações</p>
        </Link>

        <Link to="/experiencia" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Experiência (Leitor de Barras)</h2>
          <p className="text-gray-600">Use a câmera para ler códigos de barras</p>
        </Link>

        <Link to="/fidelidade" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Clube de Fidelidade</h2>
          <p className="text-gray-600">Acumule pontos e benefícios</p>
        </Link>

        <Link to="/listas-pre-prontas" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listas Pré-prontas</h2>
          <p className="text-gray-600">Sugestões para facilitar suas compras</p>
        </Link>

        <Link to="/promocoes" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Promoções</h2>
          <p className="text-gray-600">Ofertas disponíveis agora</p>
        </Link>
      </div>
    </div>
  )
}
