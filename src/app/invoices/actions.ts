'use server'

import { createClient } from '@/utils/supabase/server'
import { InvoiceFormValues } from '@/lib/schemas'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createInvoice(data: InvoiceFormValues) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
      redirect('/login')
  }
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-url')) {
      console.log('Mock creating invoice:', data)
      redirect('/dashboard')
  }

  const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      client_name: data.toName,
      amount: data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0),
      status: data.status,
      currency: data.currency,
      created_at: data.date.toISOString(),
      data: data // Save the entire form data object to the JSONB column
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
