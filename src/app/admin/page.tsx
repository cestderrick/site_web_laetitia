'use client'

import { useState } from 'react'
import AdminLogin    from '@/components/admin/AdminLogin'
import AdminSlots    from '@/components/admin/AdminSlots'
import AdminContent  from '@/components/admin/AdminContent'

type Tab = 'slots' | 'content'

export default function AdminPage() {
  const [key,     setKey]     = useState<string | null>(null)
  const [tab,     setTab]     = useState<Tab>('slots')

  if (!key) return <AdminLogin onLogin={setKey} />

  return (
    <div className="min-h-screen bg-blanc-casse">
      {/* Header admin */}
      <header className="bg-texte text-blanc-casse px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-rose-saumon text-xl font-heading">P.ose</span>
          <span className="text-blanc-casse/40 text-sm">— Panel Admin</span>
        </div>
        <button
          onClick={() => setKey(null)}
          className="text-blanc-casse/50 hover:text-blanc-casse text-sm transition-colors"
        >
          Se déconnecter
        </button>
      </header>

      {/* Onglets */}
      <div className="border-b border-rose-pastel/30 bg-white px-6">
        <nav className="flex gap-1 max-w-5xl mx-auto">
          {([
            { id: 'slots',   label: '📅 Créneaux & Types de séance' },
            { id: 'content', label: '✏️ Textes & Images' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-rose-saumon text-rose-saumon'
                  : 'border-transparent text-texte/50 hover:text-texte'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {tab === 'slots'   && <AdminSlots   adminKey={key} />}
        {tab === 'content' && <AdminContent adminKey={key} />}
      </main>
    </div>
  )
}
