'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function AuthButton() {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return <Link href="/login" className="hover:text-brand">Login</Link>
  }

  return (
    <div className="flex items-center gap-4">
        <Link href="/orders" className="hover:text-brand">Orders</Link>
      <span className="hidden normal-case text-gray-400 lg:inline">{user.email}</span>
      <button onClick={handleLogout} className="uppercase hover:text-brand">Logout</button>
    </div>
  )
}