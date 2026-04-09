import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

export default function ProductosMasVendidosChart({ data, loading }) {
  if (loading) {
    return (
      <Card title="Productos Más Vendidos">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Productos Más Vendidos">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </Card>
    )
  }

  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    nombre: item.nombreProducto.length > 20 
      ? item.nombreProducto.substring(0, 20) + '...' 
      : item.nombreProducto,
    cantidad: item.cantidadVendida,
    total: item.totalVendido
  }))

  return (
    <Card title="Top 10 Productos Más Vendidos">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre" 
            angle={-45} 
            textAnchor="end" 
            height={100}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'total') {
                return ['$' + value.toLocaleString(), 'Ingresos']
              }
              return [value, 'Cantidad']
            }}
          />
          <Legend />
          <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad Vendida" />
          <Bar dataKey="total" fill="#10b981" name="Ingresos" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}