export function groupPendingByDate(pedidos = []) {
  const grouped = pedidos.reduce((acc, pedido) => {
    const current = acc.get(pedido.fecha) ?? { fecha: pedido.fecha, pedidos: 0, unidades: 0 }
    current.pedidos += 1
    current.unidades += Number(pedido.cantidad) || 0
    acc.set(pedido.fecha, current)
    return acc
  }, new Map())

  return [...grouped.values()].sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export function normalizeMenuQuotas(menus = []) {
  return menus
    .map((menu) => ({
      id: menu.id,
      nombre: menu.nombre,
      fecha: menu.fecha,
      disponible: Number(menu.cupoDisponible ?? menu.cupoDiario ?? 0),
      total: Number(menu.cupoDiario ?? 0),
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.nombre.localeCompare(b.nombre))
}
