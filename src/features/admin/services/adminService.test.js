import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@/lib/axios', () => ({
  default: { get, patch: vi.fn() },
}))

import adminService from './adminService'

describe('adminService.getAllPedidos', () => {
  beforeEach(() => get.mockReset())

  it('recorre todas las paginas y conserva los filtros', async () => {
    get
      .mockResolvedValueOnce({
        data: { pedidos: [{ id: 1 }], total: 201 },
      })
      .mockResolvedValueOnce({
        data: { pedidos: [{ id: 2 }] },
      })
      .mockResolvedValueOnce({
        data: { pedidos: [{ id: 3 }] },
      })

    await expect(adminService.getAllPedidos({ estado: 'pendiente' })).resolves.toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    expect(get).toHaveBeenNthCalledWith(1, '/pedidos', {
      params: { estado: 'pendiente', page: 1, limit: 100 },
    })
    expect(get).toHaveBeenNthCalledWith(3, '/pedidos', {
      params: { estado: 'pendiente', page: 3, limit: 100 },
    })
  })
})
