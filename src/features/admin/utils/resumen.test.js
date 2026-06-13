import { describe, expect, it } from 'vitest'
import { groupPendingByDate, normalizeMenuQuotas } from './resumen'

describe('groupPendingByDate', () => {
  it('agrupa pedidos y unidades pendientes por fecha', () => {
    expect(
      groupPendingByDate([
        { fecha: '2030-02-16', cantidad: 1 },
        { fecha: '2030-02-15', cantidad: 2 },
        { fecha: '2030-02-15', cantidad: 3 },
      ])
    ).toEqual([
      { fecha: '2030-02-15', pedidos: 2, unidades: 5 },
      { fecha: '2030-02-16', pedidos: 1, unidades: 1 },
    ])
  })
})

describe('normalizeMenuQuotas', () => {
  it('usa cupo diario como respaldo y ordena por fecha', () => {
    expect(
      normalizeMenuQuotas([
        { id: 2, nombre: 'B', fecha: '2030-02-16', cupoDiario: 20 },
        { id: 1, nombre: 'A', fecha: '2030-02-15', cupoDiario: 30, cupoDisponible: 12 },
      ])
    ).toEqual([
      { id: 1, nombre: 'A', fecha: '2030-02-15', total: 30, disponible: 12 },
      { id: 2, nombre: 'B', fecha: '2030-02-16', total: 20, disponible: 20 },
    ])
  })
})
