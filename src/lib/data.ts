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
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()
  
  // Check if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      return [
          { id: 'INV-001', created_at: new Date().toISOString(), client_name: 'Acme Corp', amount: 1200.00, status: 'paid', currency: 'USD' },
          { id: 'INV-002', created_at: new Date(Date.now() - 86400000).toISOString(), client_name: 'Globex Inc', amount: 850.50, status: 'pending', currency: 'USD' },
          { id: 'INV-003', created_at: new Date(Date.now() - 172800000).toISOString(), client_name: 'Soylent Corp', amount: 2300.00, status: 'overdue', currency: 'EUR' },
      ]
  }

  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
  
  if (error) {
      console.error('Error fetching invoices:', error)
      return []
  }

  return data as Invoice[] || []
}

export async function getInvoice(id: string): Promise<InvoiceFormValues | null> {
    const supabase = await createClient()

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

    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single()
    if (error) return null
    
    // Simplistic mapping
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
