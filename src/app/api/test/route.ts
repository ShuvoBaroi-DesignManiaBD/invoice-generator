import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No user logged in' })
  }

  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      invoices(count)
    `)
    .eq('user_id', user.id)

  return NextResponse.json({ user: user.id, data, error })
}
