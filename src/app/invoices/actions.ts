'use server'

import { createClient } from '@/utils/supabase/server'
import { InvoiceFormValues } from '@/lib/schemas'
import { redirect } from 'next/navigation'

export async function createInvoice(data: InvoiceFormValues) {
  const supabase = await createClient()
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      console.log('Mock creating invoice:', data)
      redirect('/dashboard')
  }

  const { error } = await supabase.from('invoices').insert({
      client_name: data.toName,
      amount: data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0),
      status: data.status,
      currency: data.currency,
      created_at: data.date.toISOString(),
  })

  if (error) {
      return { error: error.message }
  }

  redirect('/dashboard')
}
