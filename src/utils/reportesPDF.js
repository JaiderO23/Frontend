import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value || 0)

const headerPDF = (doc, titulo, subtitulo = '') => {
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, 210, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SUPERMERCADO', 14, 14)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Neiva, Huila - Colombia', 14, 22)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(titulo, 14, 31)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  if (subtitulo) doc.text(subtitulo, 14, 42)
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 140, 42)
  return 48
}

export const generarReporteMensual = async (dashboard, mesSeleccionado, reportesService) => {
  const [año, mes] = mesSeleccionado.split('-')

  const [productosRes, deudaRes, metodoPagoRes] = await Promise.all([
    reportesService.productosMasVendidos(10),
    reportesService.clientesConDeuda(),
    reportesService.ventasPorMetodoPago()
  ])

  const doc = new jsPDF()
  const nombreMes = new Date(año, mes - 1).toLocaleString('es-CO', { month: 'long', year: 'numeric' })
  let y = headerPDF(doc, 'REPORTE MENSUAL', `Período: ${nombreMes.toUpperCase()}`)

  // Resumen financiero
  doc.setFillColor(243, 244, 246)
  doc.rect(14, y, 182, 8, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('RESUMEN FINANCIERO', 16, y + 6)
  doc.setTextColor(0, 0, 0)
  y += 12

  const totalDeuda = deudaRes.data?.reduce((sum, c) => sum + (c.saldoDeuda || 0), 0) || 0

  autoTable(doc, {
    startY: y,
    body: [
      ['Total Ventas del Mes', formatCurrency(dashboard?.totalVentasMes || 0)],
      ['Número de Ventas', `${dashboard?.ventasMes || 0} ventas`],
      ['Total Abonos Recibidos', formatCurrency(dashboard?.totalAbonosHoy || 0)],
      ['Cartera Pendiente', formatCurrency(totalDeuda)],
      ['Clientes con Deuda', `${deudaRes.data?.length || 0} clientes`],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 100 }, 1: { cellWidth: 82, halign: 'right' } },
    alternateRowStyles: { fillColor: [249, 250, 251] }
  })
  y = doc.lastAutoTable.finalY + 10

  // Ventas por método de pago
  if (metodoPagoRes.data?.length > 0) {
    doc.setFillColor(243, 244, 246)
    doc.rect(14, y, 182, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(37, 99, 235)
    doc.text('VENTAS POR MÉTODO DE PAGO', 16, y + 6)
    doc.setTextColor(0, 0, 0)
    y += 12

    autoTable(doc, {
      startY: y,
      head: [['Método', 'Cantidad', 'Total']],
      body: metodoPagoRes.data.map(m => [
        m.metodoPago || m.metodo_pago,
        m.cantidadVentas || m.cantidad,
        formatCurrency(m.totalVendido || m.total)
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    })
    y = doc.lastAutoTable.finalY + 10
  }

  // Top productos
  if (productosRes.data?.length > 0) {
    doc.setFillColor(243, 244, 246)
    doc.rect(14, y, 182, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(37, 99, 235)
    doc.text('TOP 10 PRODUCTOS MÁS VENDIDOS', 16, y + 6)
    doc.setTextColor(0, 0, 0)
    y += 12

    autoTable(doc, {
      startY: y,
      head: [['#', 'Producto', 'Cantidad', 'Total Vendido']],
      body: productosRes.data.map((p, i) => [
        i + 1,
        p.nombreProducto || p.nombre,
        p.cantidadVendida || p.cantidad,
        formatCurrency(p.totalVendido || p.total)
      ]),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    })
  }

  doc.save(`reporte-mensual-${mesSeleccionado}.pdf`)
}

export const generarStockBajo = async (reportesService) => {
  const res = await reportesService.productosStockBajo()
  const productos = res.data || []

  const doc = new jsPDF()
  let y = headerPDF(doc, 'PRODUCTOS CON STOCK BAJO', `Total: ${productos.length} productos requieren reabastecimiento`)

  if (productos.length === 0) {
    doc.setFontSize(12)
    doc.text('No hay productos con stock bajo en este momento.', 14, y + 10)
  } else {
    const totalInversion = productos.reduce((sum, p) =>
      sum + ((p.stockMinimo - p.stockActual) * (p.precioCompra || 0)), 0)

    doc.setFillColor(254, 243, 199)
    doc.rect(14, y, 182, 10, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(146, 64, 14)
    doc.text(`Inversion estimada para reponer stock: ${formatCurrency(totalInversion)}`, 16, y + 7)
    doc.setTextColor(0, 0, 0)
    y += 14

    autoTable(doc, {
      startY: y,
      head: [['Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Faltante', 'Precio Compra', 'Inversión']],
      body: productos.map(p => {
        const faltante = Math.max((p.stockMinimo || 0) - (p.stockActual || 0), 0)
        return [
          p.nombre,
          p.categoriaNombre || p.categoria?.nombre || '-',
          p.stockActual,
          p.stockMinimo,
          faltante,
          formatCurrency(p.precioCompra),
          formatCurrency(faltante * (p.precioCompra || 0))
        ]
      }),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] },
      alternateRowStyles: { fillColor: [255, 249, 249] },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center', fontStyle: 'bold', textColor: [220, 38, 38] },
        5: { halign: 'right' },
        6: { halign: 'right', fontStyle: 'bold' }
      }
    })
  }

  doc.save(`stock-bajo-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generarCierreCaja = async (dashboard, reportesService) => {
  const metodoPagoRes = await reportesService.ventasPorMetodoPago()

  const doc = new jsPDF()
  const hoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  let y = headerPDF(doc, 'CIERRE DE CAJA DIARIO', hoy.toUpperCase())

  const totalHoy = dashboard?.totalVentasHoy || 0
  const abonosHoy = dashboard?.totalAbonosHoy || 0

  autoTable(doc, {
    startY: y,
    body: [
      ['Total Ventas del Día', formatCurrency(totalHoy)],
      ['Número de Transacciones', `${dashboard?.ventasHoy || 0} ventas`],
      ['Abonos Recibidos', formatCurrency(abonosHoy)],
      ['TOTAL INGRESADO', formatCurrency(totalHoy + abonosHoy)],
    ],
    theme: 'grid',
    styles: { fontSize: 11 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 100 }, 1: { cellWidth: 82, halign: 'right' } },
    bodyStyles: { minCellHeight: 10 },
    alternateRowStyles: { fillColor: [243, 244, 246] },
    didParseCell: (data) => {
      if (data.row.index === 3) {
        data.cell.styles.fillColor = [37, 99, 235]
        data.cell.styles.textColor = [255, 255, 255]
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = 12
      }
    }
  })
  y = doc.lastAutoTable.finalY + 10

  if (metodoPagoRes.data?.length > 0) {
    doc.setFillColor(243, 244, 246)
    doc.rect(14, y, 182, 8, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(37, 99, 235)
    doc.text('DESGLOSE POR MÉTODO DE PAGO', 16, y + 6)
    doc.setTextColor(0, 0, 0)
    y += 12

    autoTable(doc, {
      startY: y,
      head: [['Método de Pago', 'Transacciones', 'Total']],
      body: metodoPagoRes.data.map(m => [
        m.metodoPago || m.metodo_pago,
        m.cantidadVentas || m.cantidad,
        formatCurrency(m.totalVendido || m.total)
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    })
    y = doc.lastAutoTable.finalY + 15
  }

  doc.setFontSize(10)
  doc.text('_______________________', 30, y + 20)
  doc.text('_______________________', 120, y + 20)
  doc.text('Cajero/a', 45, y + 26)
  doc.text('Propietario/a', 132, y + 26)

  doc.save(`cierre-caja-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generarClientesDeuda = async (reportesService) => {
  const res = await reportesService.clientesConDeuda()
  const clientes = res.data || []

  const doc = new jsPDF()
  let y = headerPDF(doc, 'CLIENTES CON DEUDA PENDIENTE', `Total: ${clientes.length} clientes con cartera`)

  if (clientes.length === 0) {
    doc.setFontSize(12)
    doc.text('No hay clientes con deuda pendiente.', 14, y + 10)
  } else {
    const totalCartera = clientes.reduce((sum, c) => sum + (c.saldoDeuda || 0), 0)

    doc.setFillColor(254, 226, 226)
    doc.rect(14, y, 182, 10, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(153, 27, 27)
    doc.text(`Total cartera pendiente: ${formatCurrency(totalCartera)}`, 16, y + 7)
    doc.setTextColor(0, 0, 0)
    y += 14

    autoTable(doc, {
      startY: y,
      head: [['Cliente', 'Teléfono', 'Documento', 'Deuda', 'Límite Crédito']],
      body: clientes.map(c => [
        c.nombreCompleto || '-',
        c.telefono || '-',
        c.numeroDocumento || '-',
        formatCurrency(c.saldoDeuda),
        formatCurrency(c.limiteCredito)
      ]),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [153, 27, 27] },
      alternateRowStyles: { fillColor: [255, 249, 249] },
      columnStyles: {
        3: { halign: 'right', fontStyle: 'bold', textColor: [153, 27, 27] },
        4: { halign: 'right' }
      }
    })
  }

  doc.save(`clientes-deuda-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generarProductosVendidos = async (reportesService) => {
  const res = await reportesService.productosMasVendidos(20)
  const productos = res.data || []

  const doc = new jsPDF()
  let y = headerPDF(doc, 'PRODUCTOS MÁS VENDIDOS', `Top ${productos.length} productos`)

  autoTable(doc, {
    startY: y,
    head: [['#', 'Producto', 'Categoría', 'Unidades Vendidas', 'Total Vendido']],
    body: productos.map((p, i) => [
      i + 1,
      p.nombreProducto || p.nombre,
      p.categoriaNombre || '-',
      p.cantidadVendida || p.cantidad,
      formatCurrency(p.totalVendido || p.total)
    ]),
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 70 },
      2: { cellWidth: 40 },        // ← ancho fijo para categoría
      3: { halign: 'center', cellWidth: 30 },
      4: { halign: 'right', fontStyle: 'bold', cellWidth: 35 }
    }
  })

  doc.save(`productos-mas-vendidos-${new Date().toISOString().split('T')[0]}.pdf`)
}