'use server'

import { createClient } from '@/utils/supabase/server'
import { ClientFormValues, clientSchema } from '@/lib/schemas'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createClientAction(data: ClientFormValues) {
  const result = clientSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Invalid client data" }
  }

  const validData = result.data
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase.from('clients').insert({
    user_id: user.id,
    name: validData.name,
    email: validData.email,
    address: validData.address,
    phone: validData.phone,
    vat_number: validData.vatNumber,
    reg_number: validData.regNumber,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { success: true }
}

export async function updateClientAction(id: string, data: ClientFormValues) {
  const result = clientSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Invalid client data" }
  }

  const validData = result.data
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from('clients')
    .update({
      name: validData.name,
      email: validData.email,
      address: validData.address,
      phone: validData.phone,
      vat_number: validData.vatNumber,
      reg_number: validData.regNumber,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { success: true }
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { success: true }
}

export async function getClients() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return data
}
