'use server'

import { createClient } from '@/utils/supabase/server'
import { AccountValues, CompanyDetailsValues } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function updateCompanyDetails(data: CompanyDetailsValues) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    data: {
      company_name: data.companyName,
      company_email: data.companyEmail,
      company_address: data.companyAddress,
      company_phone: data.companyPhone,
      company_vat: data.companyVat,
      company_reg_number: data.companyRegNumber,
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/my-company')
  return { success: true }
}

export async function updateAccountSettings(data: AccountValues) {
    const supabase = await createClient()
    
    const updates: { password?: string, data?: { full_name: string } } = {
        data: { full_name: data.fullName }
    }

    if (data.password && data.password.length > 0) {
        updates.password = data.password
    }

    const { error } = await supabase.auth.updateUser(updates)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/settings/account')
    return { success: true }
}

export async function updateThemePreference(theme: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        data: { theme_preference: theme }
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/settings/appearance')
    return { success: true }
}

export async function getUserMetadata() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    return user?.user_metadata || {}
}
