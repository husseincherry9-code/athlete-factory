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
    // المستخدم الحالي عند تحميل الصفحة
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // متابعة الدخول والخروج لحظيًا
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
    return <Link href="/login" className="hover:text-orange-600">Login</Link>
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-gray-500 sm:inline">{user.email}</span>
      <button onClick={handleLogout} className="hover:text-orange-600">Logout</button>
    </div>
  )
}