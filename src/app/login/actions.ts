'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
