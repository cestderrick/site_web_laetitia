'use client'

import { useEffect, useState } from 'react'
import { useContent, cs } from '@/hooks/useContent'

const S  = 'rdvForm'
const DR = {
  s1_label:     'Sophrologie',
  s1_color:     '#a8c5b0',
  s2_label:     'Coaching',
  s2_color:     '#f0806b',
  s3_label:     'Les deux',
  s3_color:     '#8b6fba',
  fc_question:  'Est-ce votre première prise de contact ?',
  fc_oui:       'Oui, première fois',
  fc_non:       'Non, je connais déjà',
  fc_message:   'Laetitia vous appellera avant le RDV pour mieux comprendre votre besoin et préparer votre séance ensemble.',
  submit_label: 'Confirmer mon rendez-vous →',
  submit_note:  'Un email de confirmation vous sera envoyé après réservation.',
}

type Slot = {
  id: string; date: string; startTime: string; endTime: string
  durationMinutes: number; location: string; allowVisio: boolean; status: string
}

type Step = 'slot' | 'mode' | 'form' | 'done' | 'error'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris',
  })
}

function groupByDay(slots: Slot[]) {
  const map = new Map<string, Slot[]>()
  for (const s of slots) {
    const key = fmtDate(s.date)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return map
}

function locationLabel(location: string) {
  if (location === 'Lyon')  return '📍 Lyon – Bellecour'
  if (location === 'Giez')  return '📍 Giez (Proche Annecy)'
  return '💻 Visio'
}

export default function GoogleCalendarBooking() {
  const content = useContent()

  // Labels + couleurs depuis l'admin
  const sessionTypes = [
    { key: 's1', label: cs(content, S, 's1_label', DR.s1_label), color: cs(content, S, 's1_color', DR.s1_color) },
    { key: 's2', label: cs(content, S, 's2_label', DR.s2_label), color: cs(content, S, 's2_color', DR.s2_color) },
    { key: 's3', label: cs(content, S, 's3_label', DR.s3_label), color: cs(content, S, 's3_color', DR.s3_color) },
  ]
  const fcQuestion  = cs(content, S, 'fc_question',  DR.fc_question)
  const fcOui       = cs(content, S, 'fc_oui',       DR.fc_oui)
  const fcNon       = cs(content, S, 'fc_non',       DR.fc_non)
  const fcMessage   = cs(content, S, 'fc_message',   DR.fc_message)
  const notesPlaceholder = cs(content, S, 'notes_placeholder', 'Quelques mots pour préparer notre échange…')
  const submitLabel      = cs(content, S, 'submit_label', DR.submit_label)
  const submitNote       = cs(content, S, 'submit_note',  DR.submit_note)

  const [step,       setStep]       = useState<Step>('slot')
  const [slots,      setSlots]      = useState<Slot[]>([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState<Slot | null>(null)
  const [chosenMode, setChosenMode] = useState<'presentiel' | 'visio' | null>(null)
  const [form,       setForm]       = useState({ name: '', email: '', phone: '', notes: '', sessionType: '', isFirstContact: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg,   setErrorMsg]   = useState('')

  useEffect(() => {
    fetch(`${BACKEND}/api/slots`)
      .then(r => r.json())
      .then(d => { setSlots(d.slots || []); setLoading(false) })
      .catch(() => { setErrorMsg('Impossible de charger les créneaux.'); setStep('error'); setLoading(false) })
  }, [])

  const selectSlot = (slot: Slot) => {
    setSelected(slot)
    // Si visio uniquement ou présentiel sans option visio → pas de choix de mode
    if (slot.location === 'Visio') { setChosenMode('visio'); setStep('form') }
    else if (!slot.allowVisio)     { setChosenMode('presentiel'); setStep('form') }
    else                           { setStep('mode') }
  }

  const phoneRequired = form.isFirstContact === 'oui'

  const book = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !chosenMode) return
    setSubmitting(true)
    try {
      const res  = await fetch(`${BACKEND}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selected.id, chosenMode,
          clientName: form.name, clientEmail: form.email,
          clientPhone: form.phone, notes: form.notes,
          sessionType: form.sessionType,
          isFirstContact: form.isFirstContact === 'oui',
        }),
      })
      const data = await res.json()
      if (data.success) setStep('done')
      else { setErrorMsg(data.error || 'Erreur inconnue.'); setStep('error') }
    } catch {
      setErrorMsg('Problème de connexion. Veuillez réessayer.')
      setStep('error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Chargement ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="text-center py-12 text-texte/50">
      <div className="w-8 h-8 border-2 border-rose-saumon/30 border-t-rose-saumon rounded-full animate-spin mx-auto mb-3" />
      Chargement des disponibilités…
    </div>
  )

  // ── Choix du créneau ─────────────────────────────────────────────────────
  if (step === 'slot') {
    const grouped = groupByDay(slots)
    return (
      <div>
        <h3 className="text-2xl text-texte mb-2">Choisissez un créneau</h3>
        <p className="text-texte/50 text-sm mb-6">Tous les horaires sont en heure de Paris.</p>

        {slots.length === 0 ? (
          <div className="text-center py-10 text-texte/50">
            <p className="text-4xl mb-3">😔</p>
            <p>Aucun créneau disponible pour le moment.</p>
            <a href="/#contact" className="btn-primary inline-block mt-4">Contacter Laetitia</a>
          </div>
        ) : (
          <div className="space-y-5 max-h-[440px] overflow-y-auto pr-1">
            {Array.from(grouped.entries()).map(([day, daySlots]) => (
              <div key={day}>
                <p className="text-xs font-semibold text-texte/40 uppercase tracking-wider mb-2 capitalize">{day}</p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map(slot => (
                    <button key={slot.id} onClick={() => selectSlot(slot)}
                      className="flex flex-col items-start px-4 py-2.5 rounded-xl border border-rose-pastel/40
                                 hover:border-rose-saumon hover:bg-rose-saumon/5 transition-all text-left">
                      <span className="font-medium text-texte text-sm">{slot.startTime} – {slot.endTime}</span>
                      <span className="text-xs text-texte/50 mt-0.5">{locationLabel(slot.location)}{slot.allowVisio && slot.location !== 'Visio' ? ' · visio possible' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Choix du mode (présentiel / visio) ───────────────────────────────────
  if (step === 'mode' && selected) return (
    <div>
      <button onClick={() => setStep('slot')} className="text-texte/40 hover:text-texte text-sm mb-4 flex items-center gap-1">← Retour</button>
      <h3 className="text-2xl text-texte mb-2">Comment souhaitez-vous vous retrouver ?</h3>
      <p className="text-texte/50 text-sm mb-6 capitalize">{fmtDate(selected.date)} · {selected.startTime}–{selected.endTime}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={() => { setChosenMode('presentiel'); setStep('form') }}
          className="border-2 border-rose-pastel/40 rounded-2xl p-6 text-left hover:border-rose-saumon hover:bg-rose-saumon/5 transition-all">
          <span className="text-3xl mb-3 block">📍</span>
          <p className="font-heading text-xl text-texte">{locationLabel(selected.location)}</p>
          <p className="text-texte/50 text-sm mt-1">Séance en cabinet</p>
        </button>
        <button onClick={() => { setChosenMode('visio'); setStep('form') }}
          className="border-2 border-rose-pastel/40 rounded-2xl p-6 text-left hover:border-rose-saumon hover:bg-rose-saumon/5 transition-all">
          <span className="text-3xl mb-3 block">💻</span>
          <p className="font-heading text-xl text-texte">Visioconférence</p>
          <p className="text-texte/50 text-sm mt-1">Lien envoyé par email</p>
        </button>
      </div>
    </div>
  )

  // ── Formulaire ───────────────────────────────────────────────────────────
  if (step === 'form' && selected) {
    const modeLabel = chosenMode === 'visio' ? '💻 Visioconférence' : locationLabel(selected.location)
    return (
      <div>
        <button onClick={() => setStep(selected.allowVisio && selected.location !== 'Visio' ? 'mode' : 'slot')}
          className="text-texte/40 hover:text-texte text-sm mb-4 flex items-center gap-1">← Retour</button>

        <div className="bg-rose-saumon/10 rounded-xl px-4 py-3 mb-6 text-sm text-texte flex gap-3 items-center">
          <span className="text-xl">📅</span>
          <div>
            <p className="font-semibold capitalize">{fmtDate(selected.date)} · {selected.startTime}–{selected.endTime}</p>
            <p className="text-texte/60">{modeLabel} · {selected.durationMinutes} min</p>
          </div>
        </div>

        <form onSubmit={book} className="flex flex-col gap-5">

          {/* Type de séance */}
          <div>
            <label className="block text-sm font-medium text-texte mb-2">Type de séance *</label>
            <div className="grid grid-cols-3 gap-2">
              {sessionTypes.map(({ key, label, color }) => {
                const isActive = form.sessionType === label
                return (
                  <button key={key} type="button"
                    onClick={() => setForm({...form, sessionType: label})}
                    style={isActive ? { backgroundColor: color, borderColor: color, color: '#fff' } : {}}
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-all ${
                      isActive ? '' : 'border-rose-pastel/40 text-texte/70 hover:border-rose-saumon bg-white'
                    }`}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Première prise de contact */}
          <div>
            <label className="block text-sm font-medium text-texte mb-2">{fcQuestion} *</label>
            <div className="flex gap-3">
              {([{ val: 'oui', lbl: fcOui }, { val: 'non', lbl: fcNon }]).map(({ val, lbl }) => (
                <button key={val} type="button"
                  onClick={() => setForm({...form, isFirstContact: val})}
                  className={`flex-1 py-2.5 rounded-xl text-sm border transition-all ${
                    form.isFirstContact === val
                      ? 'bg-rose-saumon text-white border-rose-saumon'
                      : 'border-rose-pastel/40 text-texte/70 hover:border-rose-saumon bg-white'
                  }`}>
                  {lbl}
                </button>
              ))}
            </div>
            {form.isFirstContact === 'oui' && (
              <p className="mt-2 text-sm text-rose-saumon/80 bg-rose-saumon/8 rounded-lg px-3 py-2 leading-relaxed">
                📞 {fcMessage}
              </p>
            )}
          </div>

          {/* Nom + Téléphone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Nom & Prénom *</label>
              <input required type="text" placeholder="Marie Dupont"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon text-texte" />
            </div>
            <div>
              <label className="block text-sm font-medium text-texte mb-1">
                Téléphone {phoneRequired ? '*' : '(facultatif)'}
              </label>
              <input type="tel" placeholder="06 xx xx xx xx"
                required={phoneRequired}
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon text-texte" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-texte mb-1">Email *</label>
            <input required type="email" placeholder="marie@exemple.fr"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon text-texte" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-texte mb-1">Ce qui vous amène *</label>
            <textarea required rows={3} placeholder={notesPlaceholder}
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon text-texte resize-none" />
          </div>

          <button type="submit"
            disabled={submitting || !form.sessionType || !form.isFirstContact}
            className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Confirmation…' : submitLabel}
          </button>
          {submitNote && <p className="text-center text-xs text-texte/40">{submitNote}</p>}
        </form>
      </div>
    )
  }

  // ── Succès ───────────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-3xl text-texte mb-3">Rendez-vous confirmé !</h3>
      <p className="text-texte/70 mb-2">Un email de confirmation vous a été envoyé.</p>
      <p className="text-texte/60 text-sm">Laetitia vous contactera si besoin avant la séance.</p>
    </div>
  )

  // ── Erreur ───────────────────────────────────────────────────────────────
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">😔</div>
      <p className="text-texte/70 mb-4">{errorMsg}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => { setStep('slot'); setErrorMsg('') }} className="btn-outline">Réessayer</button>
        <a href="/#contact" className="btn-primary">Contacter Laetitia</a>
      </div>
    </div>
  )
}
