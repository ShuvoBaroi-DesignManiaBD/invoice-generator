import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../app/api/clients/available/route'
import * as supabaseServer from '@/utils/supabase/server'

// Mock dependencies
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn()
}))

describe('GET /api/clients/available', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase = {
      auth: {
        getUser: vi.fn()
      },
      from: vi.fn(() => mockSupabase),
      select: vi.fn(() => mockSupabase),
      eq: vi.fn(() => mockSupabase),
      order: vi.fn(() => mockSupabase),
      range: vi.fn(() => mockSupabase),
      ilike: vi.fn(() => mockSupabase)
    }

    vi.mocked(supabaseServer.createClient).mockResolvedValue(mockSupabase)
  })

  it('should return 401 if not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: 'Auth error' })
    
    const req = new Request('http://localhost/api/clients/available')
    const res = await GET(req)
    
    expect(res.status).toBe(401)
  })

  it('should return clients with invoice counts', async () => {
    const mockUser = { id: 'user-123' }
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
    
    const mockClients = [
      { id: '1', name: 'Client A', invoices: [{ count: 5 }] },
      { id: '2', name: 'Client B', invoices: [] } // No invoices
    ]
    
    mockSupabase.range.mockResolvedValue({ data: mockClients, error: null, count: 2 })

    const req = new Request('http://localhost/api/clients/available')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.data).toHaveLength(2)
    expect(data.data[0].invoice_count).toBe(5)
    expect(data.data[1].invoice_count).toBe(0)
  })

  it('should filter clients by search term', async () => {
    const mockUser = { id: 'user-123' }
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
    mockSupabase.range.mockResolvedValue({ data: [], error: null, count: 0 })

    const req = new Request('http://localhost/api/clients/available?search=test')
    await GET(req)

    expect(mockSupabase.ilike).toHaveBeenCalledWith('name', '%test%')
  })

  it('should handle pagination', async () => {
    const mockUser = { id: 'user-123' }
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
    mockSupabase.range.mockResolvedValue({ data: [], error: null, count: 0 })

    const req = new Request('http://localhost/api/clients/available?page=2&limit=20')
    await GET(req)

    // Page 2 with limit 20 means offset 20 to 39
    expect(mockSupabase.range).toHaveBeenCalledWith(20, 39)
  })
})
