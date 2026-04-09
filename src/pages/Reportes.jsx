import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Loader } from 'lucide-react'
import MetricCard from '../components/reportes/MetricCard'
import VentasPorDiaChart from '../components/reportes/VentasPorDiaChart'
import ProductosMasVendidosChart from '../components/reportes/ProductosMasVendidosChart'
import VentasPorMetodoPagoChart from '../components/reportes/VentasPorMetodoPagoChart'
import { reportesService } from '../services'
import toast from 'react-hot-toast'

export default function Reportes() {
  const [dashboard, setDashboard] = useState(null)
  const [ventasPorDia, setVentasPorDia] = useState([])
  const [productosMasVendidos, setProductosMasVendidos] = useState([])
  const [ventasPorMetodoPago, setVentasPorMetodoPago] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      const [
        dashboardRes,
        ventasDiaRes,
        productosRes,
        metodoPagoRes
      ] = await Promise.all([
        reportesService.dashboard(),
        reportesService.ventasPorDia(7),
        reportesService.productosMasVendidos(10),
        reportesService.ventasPorMetodoPago()
      ])

      setDashboard(dashboardRes.data)
      setVentasPorDia(ventasDiaRes.data)
      setProductosMasVendidos(productosRes.data)
      setVentasPorMetodoPago(metodoPagoRes.data)
      
    } catch (error) {
      toast.error('Error al cargar los reportes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
        <p className="text-gray-600 mt-1">Analítica y estadísticas del negocio</p>
      </div>

      {/* Métricas Principales */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Ventas Hoy"
            value={`$${dashboard.totalVentasHoy?.toLocaleString() || '0'}`}
            subtitle={`${dashboard.ventasHoy || 0} ventas`}
            icon={DollarSign}
            color="green"
          />
          
          <MetricCard
            title="Ventas del Mes"
            value={`$${dashboard.totalVentasMes?.toLocaleString() || '0'}`}
            subtitle={`${dashboard.ventasMes || 0} ventas`}
            icon={TrendingUp}
            color="blue"
          />
          
          <MetricCard
            title="Abonos Hoy"
            value={`$${dashboard.totalAbonosHoy?.toLocaleString() || '0'}`}
            subtitle={`${dashboard.abonosHoy || 0} abonos`}
            icon={ShoppingCart}
            color="purple"
          />
          
          <MetricCard
            title="Deudas Pendientes"
            value={`$${dashboard.totalDeudas?.toLocaleString() || '0'}`}
            subtitle={`${dashboard.clientesConDeuda || 0} clientes`}
            icon={Users}
            color="orange"
          />
        </div>
      )}

      {/* Segunda fila de métricas */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Productos con Stock Bajo"
            value={dashboard.productosStockBajo || 0}
            subtitle="Requieren reabastecimiento"
            icon={Package}
            color="red"
          />
          
          <MetricCard
            title="Top Producto del Mes"
            value={dashboard.top5ProductosMes?.[0]?.nombreProducto || 'N/A'}
            subtitle={`${dashboard.top5ProductosMes?.[0]?.cantidadVendida || 0} unidades vendidas`}
            icon={TrendingUp}
            color="yellow"
          />
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VentasPorDiaChart data={ventasPorDia} loading={false} />
        <VentasPorMetodoPagoChart data={ventasPorMetodoPago} loading={false} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProductosMasVendidosChart data={productosMasVendidos} loading={false} />
      </div>
    </div>
  )
}