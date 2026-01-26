import { createClient } from '@/utils/supabase/server'
import { InvoiceFormValues } from './schemas'

export type Invoice = {
  id: string
  created_at: string
  client_name: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft'
  currency: string
  items?: any[]
  invoiceNumber?: string
  data?: any
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []
  
  // Check if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      return [
          { id: 'INV-001', created_at: new Date().toISOString(), client_name: 'Acme Corp', amount: 1200.00, status: 'paid', currency: 'USD' },
          { id: 'INV-002', created_at: new Date(Date.now() - 86400000).toISOString(), client_name: 'Globex Inc', amount: 850.50, status: 'pending', currency: 'USD' },
          { id: 'INV-003', created_at: new Date(Date.now() - 172800000).toISOString(), client_name: 'Soylent Corp', amount: 2300.00, status: 'overdue', currency: 'EUR' },
      ]
  }

  const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  
  if (error) {
      console.error('Error fetching invoices:', error)
      return []
  }

  return data.map((invoice: any) => ({
      ...invoice,
      invoiceNumber: invoice.data?.invoiceNumber || invoice.id, // Use saved invoice number or fallback to ID
  })) as Invoice[]
}

export async function getRevenueOverTime() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Check if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      return [
          { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
      ]
  }

  const { data, error } = await supabase
      .from('invoices')
      .select('amount, created_at')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
      .order('created_at', { ascending: true })

  if (error) {
      console.error('Error fetching revenue data:', error)
      return []
  }

  // Group by month
  const monthlyRevenue: Record<string, number> = {}
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const month = d.toLocaleString('default', { month: 'short' })
      monthlyRevenue[month] = 0
  }

  data.forEach((invoice: any) => {
      const date = new Date(invoice.created_at)
      const month = date.toLocaleString('default', { month: 'short' })
      if (monthlyRevenue[month] !== undefined) {
          monthlyRevenue[month] += Number(invoice.amount)
      }
  })

  return Object.entries(monthlyRevenue).map(([name, total]) => ({ name, total }))
}

export async function getInvoice(id: string): Promise<InvoiceFormValues | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
        return {
            invoiceNumber: 'INV-001',
            date: new Date(),
            dueDate: new Date(),
            status: 'draft',
            fromName: 'Me',
            fromEmail: 'me@example.com',
            toName: 'Acme Corp',
            toEmail: 'client@example.com',
            items: [{ description: 'Service', quantity: 1, price: 100 }],
            currency: 'USD',
            taxRate: 0,
            discount: 0
        } as InvoiceFormValues
    }

    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
    if (error) return null
    
    // If we have saved data in the JSONB column, use it
    if (data.data) {
        return {
            ...data.data,
            id: data.id,
            // Ensure essential fields are not overwritten if somehow missing in data but present in columns
            // though createInvoice saves everything to data.
            date: new Date(data.data.date), // Rehydrate dates
            dueDate: new Date(data.data.dueDate),
        } as InvoiceFormValues
    }

    // Simplistic mapping for legacy records without JSONB data
    return {
        invoiceNumber: data.id, // using ID as number for now
        date: new Date(data.created_at),
        dueDate: new Date(), // missing
        status: data.status,
        fromName: '', // missing
        toName: data.client_name,
        items: [], // missing
        currency: data.currency,
        taxRate: 0,
        discount: 0
    } as unknown as InvoiceFormValues
}
