'use client'

import { useEffect, useState } from 'react'

type Slot = { start: string; end: string }

type BookingStep = 'type' | 'slot' | 'form' | 'confirm' | 'done' | 'error'

const TYPES = [
  { id: 'Coaching',    label: 'Séance de Coaching',    emoji: '🎯', desc: '60 min · Transition, décision, confiance en soi' },
  { id: 'Sophrologie', label: 'Séance de Sophrologie', emoji: '🌿', desc: '60 min · Respiration, gestion du stress, ressources' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'Europe/Paris',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

function groupSlotsByDay(slots: Slot[]) {
  const map = new Map<string, Slot[]>()
  for (const slot of slots) {
    const day = formatDate(slot.start)
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(slot)
  }
  return map
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export default function GoogleCalendarBooking() {
  const [step,     setStep]     = useState<BookingStep>('type')
  const [type,     setType]     = useState<string>('')
  const [slots,    setSlots]    = useState<Slot[]>([])
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState<Slot | null>(null)
  const [form,     setForm]     = useState({ name: '', email: '', phone: '', notes: '' })
  const [errorMsg, setErrorMsg] = useState('')

  // Charger les créneaux après choix du type
  useEffect(() => {
    if (step !== 'slot') return
    setLoading(true)
    fetch(`${BACKEND_URL}/api/slots?days=30`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots || []); setLoading(false) })
      .catch(() => { setErrorMsg('Impossible de charger les créneaux.'); setStep('error'); setLoading(false) })
  }, [step])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: selected.start,
          end:   selected.end,
          type,
          clientName:  form.name,
          clientEmail: form.email,
          clientPhone: form.phone,
          notes:       form.notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('done')
      } else {
        setErrorMsg(data.error || 'Erreur inconnue.')
        setStep('error')
      }
    } catch {
      setErrorMsg('Problème de connexion. Veuillez réessayer.')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  // ── ÉTAPE 1 : Choix du type ───────────────────────────────────────────────
  if (step === 'type') return (
    <div>
      <h3 className="text-2xl text-texte text-center mb-6">Quel type de séance souhaitez-vous ?</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); setStep('slot') }}
            className="border-2 border-rose-pastel/40 rounded-2xl p-6 text-left hover:border-rose-saumon hover:bg-rose-saumon/5 transition-all group"
          >
            <span className="text-4xl mb-3 block">{t.emoji}</span>
            <p className="font-heading text-xl text-texte group-hover:text-rose-saumon transition-colors">{t.label}</p>
            <p className="text-texte/60 text-sm mt-1">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )

  // ── ÉTAPE 2 : Choix du créneau ────────────────────────────────────────────
  if (step === 'slot') {
    const grouped = groupSlotsByDay(slots)
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('type')} className="text-texte/40 hover:text-texte text-sm flex items-center gap-1">
            ← Retour
          </button>
          <h3 className="text-2xl text-texte">Choisissez un créneau</h3>
        </div>

        {loading && (
          <div className="text-center py-12 text-texte/50">
            <div className="w-8 h-8 border-2 border-rose-saumon/30 border-t-rose-saumon rounded-full animate-spin mx-auto mb-3" />
            Chargement des disponibilités…
          </div>
        )}

        {!loading && slots.length === 0 && (
          <div className="text-center py-12 text-texte/60">
            <p className="text-5xl mb-4">😔</p>
            <p>Aucun créneau disponible dans les 30 prochains jours.</p>
            <p className="text-sm mt-2">Contactez Laetitia directement pour convenir d'un rendez-vous.</p>
          </div>
        )}

        <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
          {Array.from(grouped.entries()).map(([day, daySlots]) => (
            <div key={day}>
              <p className="text-sm font-semibold text-texte/50 uppercase tracking-wider mb-2 capitalize">{day}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map(slot => (
                  <button
                    key={slot.start}
                    onClick={() => { setSelected(slot); setStep('form') }}
                    className="px-4 py-2 rounded-xl border border-rose-pastel/40 text-texte text-sm
                               hover:border-rose-saumon hover:bg-rose-saumon hover:text-white transition-all"
                  >
                    {formatTime(slot.start)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── ÉTAPE 3 : Formulaire ──────────────────────────────────────────────────
  if (step === 'form' && selected) return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setStep('slot')} className="text-texte/40 hover:text-texte text-sm flex items-center gap-1">
          ← Retour
        </button>
        <h3 className="text-2xl text-texte">Vos coordonnées</h3>
      </div>

      {/* Récap créneau */}
      <div className="bg-rose-saumon/10 rounded-xl px-4 py-3 mb-6 text-sm text-texte flex gap-3 items-center">
        <span className="text-xl">{TYPES.find(t => t.id === type)?.emoji}</span>
        <div>
          <p className="font-semibold">{type} · {formatDate(selected.start)}</p>
          <p className="text-texte/60">{formatTime(selected.start)} – {formatTime(selected.end)}</p>
        </div>
      </div>

      <form onSubmit={handleBook} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-texte mb-1">Nom & Prénom *</label>
            <input
              required type="text" placeholder="Marie Dupont"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texte mb-1">Téléphone</label>
            <input
              type="tel" placeholder="06 xx xx xx xx"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Email *</label>
          <input
            required type="email" placeholder="marie@exemple.fr"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-texte mb-1">Ce qui vous amène (facultatif)</label>
          <textarea
            rows={3} placeholder="Quelques mots pour que je prépare au mieux notre échange…"
            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte resize-none"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Confirmation en cours…' : 'Confirmer mon rendez-vous →'}
        </button>
        <p className="text-center text-xs text-texte/40">
          Un email de confirmation vous sera envoyé après réservation.
        </p>
      </form>
    </div>
  )

  // ── DONE ─────────────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-3xl text-texte mb-3">Rendez-vous confirmé !</h3>
      <p className="text-texte/70 mb-2">Un email de confirmation vous a été envoyé.</p>
      <p className="text-texte/60 text-sm">
        Laetitia vous contactera si besoin avant la séance.
      </p>
    </div>
  )

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (step === 'error') return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">😔</div>
      <p className="text-texte/70 mb-4">{errorMsg}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => { setStep('type'); setErrorMsg('') }} className="btn-outline">
          Réessayer
        </button>
        <a href="/#contact" className="btn-primary">
          Contacter Laetitia
        </a>
      </div>
    </div>
  )

  return null
}
