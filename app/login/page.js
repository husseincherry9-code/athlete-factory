
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [supabase] = useState(() => createClient())
  const router = useRouter()

  const [mode, setMode] = useState('login') // 'login' أو 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const isLogin = mode === 'login'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    if (!isLogin && !data.session) {
      setMessage({ type: 'success', text: 'Account created! Check your email to confirm it.' })
      return
    }

    // الرجوع للصفحة المطلوبة (روابط داخلية فقط، لمنع التحويل لمواقع خارجية)
    const next = new URLSearchParams(window.location.search).get('next')
    router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/')
    router.refresh()
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isLogin ? 'Log in to your account' : 'Join The Athlete Factory'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-brand"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-brand"
              placeholder="At least 6 characters"
            />
          </div>

          {message && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 font-semibold text-black transition hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setMode(isLogin ? 'signup' : 'login')
              setMessage(null)
            }}
            className="font-semibold text-brand-deep hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </main>
  )
}