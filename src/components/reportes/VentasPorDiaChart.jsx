import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

export default function VentasPorDiaChart({ data, loading }) {
  if (loading) {
    return (
      <Card title="Ventas por Día">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Ventas por Día">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </Card>
    )
  }

  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-CO', { 
      month: 'short', 
      day: 'numeric' 
    }),
    total: item.totalVentas,
    cantidad: item.cantidadVentas
  }))

  return (
    <Card title="Ventas de los Últimos 7 Días">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'total') {
                return ['$' + value.toLocaleString(), 'Total Ventas']
              }
              return [value, 'Cantidad']
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Total Ventas"
          />
          <Line 
            type="monotone" 
            dataKey="cantidad" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Cantidad"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}