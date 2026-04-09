import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function VentasPorMetodoPagoChart({ data, loading }) {
  if (loading) {
    return (
      <Card title="Ventas por Método de Pago">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Ventas por Método de Pago">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </Card>
    )
  }

  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    name: item.metodoPago,
    value: item.totalVentas,
    cantidad: item.cantidadVentas
  }))

  return (
    <Card title="Ventas por Método de Pago">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => '$' + value.toLocaleString()}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}