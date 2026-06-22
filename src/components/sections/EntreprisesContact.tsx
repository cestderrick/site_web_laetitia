'use client'

import { useState } from 'react'
import { useContent, cs } from '@/hooks/useContent'

const S = 'devis'
const D = {
  titre:     'Parlons de votre projet',
  sousTitre: "Remplissez le formulaire et Laetitia vous recontacte sous 48h pour affiner votre besoin et vous proposer un devis personnalisé.",
  cta:       'Envoyer ma demande de devis →',
  note:      'Réponse sous 48h · Devis gratuit et sans engagement',
  effectifs: '1–10, 11–50, 51–200, 200+',
  besoins:   "Atelier sophrologie, Coaching d'équipe, Programme bien-être, Conférence / Sensibilisation, Autre",
  formats:   'Présentiel Lyon, Présentiel Giez, Visioconférence, Les deux',
}

function splitList(val: string): string[] {
  return val.split(',').map(v => v.trim()).filter(Boolean)
}

const INPUT = "w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon text-texte"

export default function EntreprisesContact() {
  const content = useContent()

  const ctaLabel  = cs(content, S, 'cta',       D.cta)
  const note      = cs(content, S, 'note',      D.note)
  const effectifs = splitList(cs(content, S, 'effectifs', D.effectifs))
  const besoins   = splitList(cs(content, S, 'besoins',   D.besoins))
  const formats   = splitList(cs(content, S, 'formats',   D.formats))

  const [form, setForm] = useState({
    societe: '', contact: '', email: '', telephone: '',
    effectif: '', besoin: '', format: '', message: '',
  })
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/contact/entreprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Une erreur est survenue.')
    } catch {
      setError("Impossible d'envoyer le formulaire. Contactez directement Laetitia.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="max-w-xl mx-auto text-center bg-blanc-casse rounded-2xl p-10">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-2xl text-texte mb-2">Demande envoyée !</h3>
      <p className="text-texte/65">Laetitia vous recontacte sous 48h pour discuter de votre projet.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-blanc-casse rounded-2xl p-8 shadow-sm space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Société *</label>
          <input required type="text" placeholder="Acme SAS" value={form.societe}
            onChange={e => set('societe', e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Votre nom *</label>
          <input required type="text" placeholder="Marie Dupont" value={form.contact}
            onChange={e => set('contact', e.target.value)} className={INPUT} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Email *</label>
          <input required type="email" placeholder="marie@acme.fr" value={form.email}
            onChange={e => set('email', e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Téléphone</label>
          <input type="tel" placeholder="06 xx xx xx xx" value={form.telephone}
            onChange={e => set('telephone', e.target.value)} className={INPUT} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Effectif concerné *</label>
          <select required value={form.effectif} onChange={e => set('effectif', e.target.value)} className={INPUT}>
            <option value="">-- Choisir --</option>
            {effectifs.map(v => <option key={v} value={v}>{v} personnes</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Type d&apos;intervention *</label>
          <select required value={form.besoin} onChange={e => set('besoin', e.target.value)} className={INPUT}>
            <option value="">-- Choisir --</option>
            {besoins.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {formats.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-texte mb-2">Format souhaité</label>
          <div className="flex flex-wrap gap-2">
            {formats.map(f => (
              <button key={f} type="button" onClick={() => set('format', f)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors border ${
                  form.format === f
                    ? 'bg-rose-saumon text-white border-rose-saumon'
                    : 'bg-white border-rose-pastel/40 text-texte/70 hover:border-rose-saumon'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-texte mb-1">Votre projet en quelques mots</label>
        <textarea rows={4} placeholder="Contexte, objectifs, contraintes de calendrier…"
          value={form.message} onChange={e => set('message', e.target.value)}
          className={`${INPUT} resize-none`} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? 'Envoi en cours…' : ctaLabel}
      </button>
      {note && <p className="text-center text-xs text-texte/40">{note}</p>}
    </form>
  )
}
