import Card from '../components/ui/Card'
import { Package, Users, ShoppingCart, DollarSign, RefreshCw } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { data, loading, error, reload } = useDashboard()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el dashboard</p>
          <Button onClick={reload}>Reintentar</Button>
        </Card>
      </div>
    )
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={reload}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Actualizar
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Hoy */}
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Ventas Hoy</p>
              <p className="text-3xl font-bold text-blue-700">{data?.ventasHoy || 0}</p>
              <p className="text-sm text-blue-500 mt-1">
                {formatCurrency(data?.totalVentasHoy || 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <ShoppingCart className="text-blue-700" size={24} />
            </div>
          </div>
        </Card>
        
        {/* Ventas del Mes */}
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Ventas del Mes</p>
              <p className="text-3xl font-bold text-green-700">{data?.ventasMes || 0}</p>
              <p className="text-sm text-green-500 mt-1">
                {formatCurrency(data?.totalVentasMes || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <Package className="text-green-700" size={24} />
            </div>
          </div>
        </Card>
        
        {/* Abonos Hoy */}
        <Card className="bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Abonos Hoy</p>
              <p className="text-3xl font-bold text-purple-700">{data?.abonosHoy || 0}</p>
              <p className="text-sm text-purple-500 mt-1">
                {formatCurrency(data?.totalAbonosHoy || 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-full">
              <DollarSign className="text-purple-700" size={24} />
            </div>
          </div>
        </Card>
        
        {/* Clientes con Deuda */}
        <Card className="bg-orange-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Clientes con Deuda</p>
              <p className="text-3xl font-bold text-orange-700">{data?.clientesConDeuda || 0}</p>
              <p className="text-sm text-orange-500 mt-1">
                {formatCurrency(data?.totalDeudas || 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-full">
              <Users className="text-orange-700" size={24} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top 5 Productos */}
      <Card title="Top 5 Productos Más Vendidos del Mes">
        {data?.top5ProductosMes && data.top5ProductosMes.length > 0 ? (
          <div className="space-y-3">
            {data.top5ProductosMes.map((producto, index) => (
              <div 
                key={producto.productoId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{producto.nombreProducto}</p>
                    <p className="text-sm text-gray-500">
                      {producto.cantidadVendida} unidades vendidas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(producto.totalVendido)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No hay productos vendidos este mes
          </p>
        )}
      </Card>
      
      {/* Alertas */}
      {data?.productosStockBajo > 0 && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-200 rounded-full">
              <Package className="text-yellow-700" size={20} />
            </div>
            <div>
              <p className="font-medium text-yellow-800">
                 {data.productosStockBajo} productos con stock bajo
              </p>
              <p className="text-sm text-yellow-600">
                Revisa el inventario para evitar faltantes
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}