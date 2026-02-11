import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Página não encontrada</h1>
      <p className="text-gray-600">A rota acessada não existe ou foi movida.</p>
      <div className="flex gap-3">
        <Link to="/" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
          Ir para Início
        </Link>
        <Link to="/app" className="text-primary-600 hover:text-primary-700 px-4 py-2 rounded-md border border-primary-200">
          Ir para o App
        </Link>
      </div>
    </div>
  )
}
