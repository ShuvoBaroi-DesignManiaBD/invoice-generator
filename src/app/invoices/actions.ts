'use server'

import { createClient } from '@/utils/supabase/server'
import { InvoiceFormValues, invoiceSchema } from '@/lib/schemas'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createInvoice(data: InvoiceFormValues) {
  const result = invoiceSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Invalid invoice data" }
  }

  const validData = result.data
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
      redirect('/login')
  }
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      console.log('Mock creating invoice:', validData)
      redirect('/dashboard')
  }

  // Calculate total amount
  const subtotal = validData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0)
  const taxRate = validData.taxRate || 0
  const discount = validData.discount || 0
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discount

  const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      client_id: validData.clientId || null,
      client_name: validData.toName,
      amount: total,
      status: validData.status,
      currency: validData.currency,
      created_at: validData.date.toISOString(),
      data: validData // Save the entire form data object to the JSONB column
  })

  if (error) {
      return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/invoices')
  redirect('/dashboard')
}

export async function deleteInvoice(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/invoices')
    return { success: true }
}
