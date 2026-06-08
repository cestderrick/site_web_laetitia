'use client'

import { useState, useEffect } from 'react'

type Review = {
  id:     string
  author: string
  rating: number
  date:   string
  text:   string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

function Stars({ n, onChange }: { n: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange?.(i)}
          className={`text-xl ${i <= n ? 'text-yellow-400' : 'text-texte/20'} ${onChange ? 'hover:scale-110 transition-transform' : ''}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function AdminReviews({ adminKey }: { adminKey: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)

  const [form, setForm] = useState({ author: '', rating: 5, offsetValue: '1', offsetUnit: 'mois', text: '' })

  const headers = { 'Content-Type': 'application/json', 'x-admin-key': adminKey }

  async function load() {
    setLoading(true)
    try {
      const r = await fetch(`${BACKEND}/api/admin/reviews`, { headers })
      const d = await r.json()
      setReviews(d.reviews || [])
    } catch {
      setError('Impossible de charger les avis.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author.trim() || !form.text.trim()) return
    setSaving(true)
    setError('')
    try {
      // Calculer la date ISO depuis l'offset
      const d = new Date()
      const n = parseInt(form.offsetValue) || 1
      if (form.offsetUnit === 'jours')    d.setDate(d.getDate() - n)
      if (form.offsetUnit === 'semaines') d.setDate(d.getDate() - n * 7)
      if (form.offsetUnit === 'mois')     d.setMonth(d.getMonth() - n)

      const r = await fetch(`${BACKEND}/api/admin/reviews`, {
        method: 'POST', headers,
        body: JSON.stringify({ ...form, date: d.toISOString() }),
      })
      if (!r.ok) throw new Error((await r.json()).error)
      setForm({ author: '', rating: 5, offsetValue: '1', offsetUnit: 'mois', text: '' })
      await load()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      await fetch(`${BACKEND}/api/admin/reviews/${id}`, { method: 'DELETE', headers })
      setReviews(r => r.filter(x => x.id !== id))
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Formulaire ajout */}
      <div className="bg-white rounded-2xl border border-rose-pastel/30 p-6">
        <h2 className="text-lg font-semibold text-texte mb-5">Ajouter un avis</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-texte/60 mb-1">Nom du client *</label>
              <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                placeholder="ex : Sophie M." required
                className="w-full border border-rose-pastel/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-xs font-medium text-texte/60 mb-1">Date de l'avis</label>
              <div className="flex gap-2">
                <input type="number" min="1" max="99"
                  value={form.offsetValue}
                  onChange={e => setForm(f => ({ ...f, offsetValue: e.target.value }))}
                  className="w-20 border border-rose-pastel/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-saumon" />
                <select value={form.offsetUnit}
                  onChange={e => setForm(f => ({ ...f, offsetUnit: e.target.value }))}
                  className="flex-1 border border-rose-pastel/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-saumon bg-white">
                  <option value="jours">jours</option>
                  <option value="semaines">semaines</option>
                  <option value="mois">mois</option>
                </select>
              </div>
              <p className="text-texte/40 text-xs mt-1">Nombre de jours/semaines/mois depuis la date de l'avis</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-texte/60 mb-2">Note *</label>
            <Stars n={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-texte/60 mb-1">Texte de l'avis *</label>
            <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              rows={3} required placeholder="Coller ici le texte de l'avis Google..."
              className="w-full border border-rose-pastel/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-saumon resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={saving}
            className="btn-primary disabled:opacity-50">
            {saving ? 'Enregistrement…' : '+ Ajouter'}
          </button>
        </form>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-2xl border border-rose-pastel/30 p-6">
        <h2 className="text-lg font-semibold text-texte mb-5">
          Avis publiés ({reviews.length})
        </h2>
        {loading ? (
          <p className="text-texte/40 text-sm">Chargement…</p>
        ) : reviews.length === 0 ? (
          <p className="text-texte/40 text-sm">Aucun avis pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="flex gap-4 items-start p-4 rounded-xl bg-blanc-casse border border-rose-pastel/20">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-texte">{r.author}</span>
                    <Stars n={r.rating} />
                    {r.date && <span className="text-texte/40 text-xs">{r.date}</span>}
                  </div>
                  <p className="text-texte/65 text-sm leading-relaxed line-clamp-3">{r.text}</p>
                </div>
                <button onClick={() => handleDelete(r.id)}
                  className="text-texte/30 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5" title="Supprimer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-texte/40 bg-vert-pastel/20 rounded-xl p-4">
        💡 Les avis s'affichent sur le site après le prochain rebuild (automatique chaque nuit à 4h, ou via <strong>Manual Deploy</strong> sur Render Service 1).
      </p>
    </div>
  )
}
