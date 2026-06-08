'use client'

import { useState } from 'react'
import Image from 'next/image'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export default function AdminLogin({ onLogin }: { onLogin: (key: string) => void }) {
  const [key,     setKey]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/admin/verify`, {
        headers: { 'x-admin-key': key },
      })
      if (res.status === 401) {
        setError('Clé incorrecte.')
      } else {
        onLogin(key)
      }
    } catch {
      setError("Impossible de contacter le backend. Vérifiez qu'il tourne.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blanc-casse flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-sm text-center">
        <Image
          src="/logos/LOGO ROSE SAUMON.png"
          alt="P.ose"
          width={120}
          height={48}
          className="mx-auto mb-6 object-contain"
        />
        <h1 className="text-2xl text-texte mb-1">Panel Admin</h1>
        <p className="text-texte/50 text-sm mb-8">Accès réservé à Laetitia</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Clé d'accès"
            value={key}
            onChange={e => setKey(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte text-center tracking-widest"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Vérification…' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  )
}
