import Card from '../components/ui/Card'

export default function Productos() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Productos</h1>
      <Card title="Productos en construcción">
        <p className="text-gray-600">Módulo de gestión de productos</p>
      </Card>
    </div>
  )
}