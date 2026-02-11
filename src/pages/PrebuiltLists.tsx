export default function PrebuiltLists() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Listas Pré-prontas</h1>
      <p className="text-gray-600 mb-6">Sugestões de listas para facilitar suas compras.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Café da Manhã</h2>
          <p className="text-gray-700">Pães, leite, café, frutas.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Churrasco</h2>
          <p className="text-gray-700">Carnes, bebidas, carvão, acompanhamentos.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Limpeza</h2>
          <p className="text-gray-700">Detergente, sabão em pó, desinfetante, esponjas.</p>
        </div>
      </div>
    </div>
  )
}
