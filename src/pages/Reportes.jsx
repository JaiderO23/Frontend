import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Loader, FileText, Download } from 'lucide-react'
import MetricCard from '../components/reportes/MetricCard'
import VentasPorDiaChart from '../components/reportes/VentasPorDiaChart'
import ProductosMasVendidosChart from '../components/reportes/ProductosMasVendidosChart'
import VentasPorMetodoPagoChart from '../components/reportes/VentasPorMetodoPagoChart'
import { reportesService } from '../services'
import toast from 'react-hot-toast'
import {
  generarReporteMensual,
  generarStockBajo,
  generarCierreCaja,
  generarClientesDeuda,
  generarProductosVendidos
} from '../utils/reportesPDF'

export default function Reportes() {
  const [dashboard, setDashboard] = useState(null)
  const [ventasPorDia, setVentasPorDia] = useState([])
  const [productosMasVendidos, setProductosMasVendidos] = useState([])
  const [ventasPorMetodoPago, setVentasPorMetodoPago] = useState([])
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(null)
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date()
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [dashboardRes, ventasDiaRes, productosRes, metodoPagoRes] = await Promise.all([
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
    } finally {
      setLoading(false)
    }
  }

  const ejecutar = async (id, fn) => {
    try {
      setGenerando(id)
      await fn()
      toast.success('Reporte generado ✓')
    } catch (error) {
      toast.error('Error al generar el reporte')
      console.error(error)
    } finally {
      setGenerando(null)
    }
  }

  const reportes = [
    {
      id: 'mensual',
      titulo: 'Reporte Mensual',
      descripcion: 'Ventas, ganancias, top productos y cartera del mes',
      color: 'blue',
      icono: TrendingUp,
      accion: () => generarReporteMensual(dashboard, mesSeleccionado, reportesService),
      extra: (
        <input
          type="month"
          value={mesSeleccionado}
          onChange={e => setMesSeleccionado(e.target.value)}
          className="mt-2 w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
      )
    },
    {
      id: 'stock',
      titulo: 'Stock Bajo',
      descripcion: 'Productos que necesitan reabastecimiento con inversión estimada',
      color: 'red',
      icono: Package,
      accion: () => generarStockBajo(reportesService)
    },
    {
      id: 'caja',
      titulo: 'Cierre de Caja Diario',
      descripcion: 'Resumen del día con desglose por método de pago y firmas',
      color: 'green',
      icono: DollarSign,
      accion: () => generarCierreCaja(dashboard, reportesService)
    },
    {
      id: 'deuda',
      titulo: 'Clientes con Deuda',
      descripcion: 'Cartera pendiente de todos los clientes con crédito activo',
      color: 'orange',
      icono: Users,
      accion: () => generarClientesDeuda(reportesService)
    },
    {
      id: 'vendidos',
      titulo: 'Productos Más Vendidos',
      descripcion: 'Top 20 productos con mayor rotación y ventas totales',
      color: 'purple',
      icono: ShoppingCart,
      accion: () => generarProductosVendidos(reportesService)
    },
  ]

  const colores = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  const botonesColor = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    purple: 'bg-purple-600 hover:bg-purple-700',
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
        <p className="text-gray-600 mt-1">Analítica y estadísticas del negocio</p>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Ventas Hoy" value={`$${dashboard.totalVentasHoy?.toLocaleString() || '0'}`} subtitle={`${dashboard.ventasHoy || 0} ventas`} icon={DollarSign} color="green" />
          <MetricCard title="Ventas del Mes" value={`$${dashboard.totalVentasMes?.toLocaleString() || '0'}`} subtitle={`${dashboard.ventasMes || 0} ventas`} icon={TrendingUp} color="blue" />
          <MetricCard title="Abonos Hoy" value={`$${dashboard.totalAbonosHoy?.toLocaleString() || '0'}`} subtitle={`${dashboard.abonosHoy || 0} abonos`} icon={ShoppingCart} color="purple" />
          <MetricCard title="Deudas Pendientes" value={`$${dashboard.totalDeudas?.toLocaleString() || '0'}`} subtitle={`${dashboard.clientesConDeuda || 0} clientes`} icon={Users} color="orange" />
        </div>
      )}

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard title="Productos con Stock Bajo" value={dashboard.productosStockBajo || 0} subtitle="Requieren reabastecimiento" icon={Package} color="red" />
          <MetricCard title="Top Producto del Mes" value={dashboard.top5ProductosMes?.[0]?.nombreProducto || 'N/A'} subtitle={`${dashboard.top5ProductosMes?.[0]?.cantidadVendida || 0} unidades vendidas`} icon={TrendingUp} color="yellow" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VentasPorDiaChart data={ventasPorDia} loading={false} />
        <VentasPorMetodoPagoChart data={ventasPorMetodoPago} loading={false} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ProductosMasVendidosChart data={productosMasVendidos} loading={false} />
      </div>

      {/* Reportes PDF */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-gray-700" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Descargar Reportes PDF</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportes.map(r => {
            const Icono = r.icono
            const cargando = generando === r.id
            return (
              <div key={r.id} className={`border-2 rounded-xl p-5 ${colores[r.color]} transition-all`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white bg-opacity-60">
                    <Icono size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{r.titulo}</h3>
                    <p className="text-xs opacity-75 mt-0.5">{r.descripcion}</p>
                  </div>
                </div>
                {r.extra}
                <button
                  onClick={() => ejecutar(r.id, r.accion)}
                  disabled={!!generando}
                  className={`mt-3 w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors ${botonesColor[r.color]} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {cargando
                    ? <><Loader size={14} className="animate-spin" /> Generando...</>
                    : <><Download size={14} /> Descargar PDF</>
                  }
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}