'use client'

import { useEffect, useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const LOCATIONS = ['Lyon', 'Giez', 'Visio']
const DURATIONS = [30, 45, 60, 90, 120]

type Slot = {
  id: string; date: string; startTime: string; endTime: string
  durationMinutes: number; location: string; allowVisio: boolean
  status: string; clientName?: string; clientEmail?: string
}

type Tab = 'list' | 'history' | 'generate' | 'add'

export default function AdminSlots({ adminKey }: { adminKey: string }) {
  const [tab,      setTab]      = useState<Tab>('list')
  const [slots,    setSlots]    = useState<Slot[]>([])
  const [loading,  setLoading]  = useState(false)
  const [msg,      setMsg]      = useState('')

  // Générateur
  const [gen, setGen] = useState({
    startDate: '', endDate: '', days: [1,2,3,4,5] as number[],
    startTime: '09:00', endTime: '18:00', durationMinutes: 60,
    location: 'Lyon', allowVisio: true,
  })

  // Ajout unique
  const [single, setSingle] = useState({
    date: '', startTime: '09:00', durationMinutes: 60,
    location: 'Lyon', allowVisio: true,
  })

  const headers = { 'x-admin-key': adminKey }

  const loadSlots = async () => {
    setLoading(true)
    const res = await fetch(`${BACKEND}/api/admin/slots`, { headers })
    const data = await res.json()
    setSlots((data.slots || []).sort((a: Slot, b: Slot) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
    ))
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [])

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500) }

  const deleteSlot = async (id: string) => {
    if (!confirm('Supprimer ce créneau ?')) return
    await fetch(`${BACKEND}/api/admin/slots/${id}`, { method: 'DELETE', headers })
    flash('Créneau supprimé.')
    loadSlots()
  }

  const releaseSlot = async (id: string) => {
    if (!confirm('Remettre ce créneau comme disponible ? (les infos client seront effacées)')) return
    const res  = await fetch(`${BACKEND}/api/admin/slots/${id}/release`, { method: 'POST', headers })
    const data = await res.json()
    if (data.success) flash('Créneau libéré — de nouveau disponible.')
    else flash(`Erreur : ${data.error}`)
    loadSlots()
  }

  const generate = async () => {
    setLoading(true)
    const res  = await fetch(`${BACKEND}/api/admin/slots/generate`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(gen),
    })
    const data = await res.json()
    if (data.success) {
      const skipInfo = data.skipped > 0 ? ` · ⚠️ ${data.skipped} ignoré${data.skipped > 1 ? 's' : ''} (conflit agenda)` : ''
      flash(`${data.count} créneaux générés !${skipInfo}`)
      setTab('list')
      loadSlots()
    } else flash(`Erreur : ${data.error}`)
    setLoading(false)
  }

  const addSingle = async () => {
    const [h, m] = single.startTime.split(':').map(Number)
    const totalEnd = h * 60 + m + single.durationMinutes
    const endTime = `${String(Math.floor(totalEnd/60)).padStart(2,'0')}:${String(totalEnd%60).padStart(2,'0')}`
    setLoading(true)
    const res  = await fetch(`${BACKEND}/api/admin/slots`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...single, endTime }),
    })
    const data = await res.json()
    if (res.status === 409 && data.conflict) {
      flash(`⚠️ Conflit agenda — ce créneau chevauche un événement existant`)
    } else if (data.success) {
      flash('Créneau ajouté !')
      setTab('list')
      loadSlots()
    } else {
      flash(`Erreur : ${data.error}`)
    }
    setLoading(false)
  }

  // Date du jour (YYYY-MM-DD) pour filtrage
  const todayStr = new Date().toLocaleDateString('sv') // 'YYYY-MM-DD' via locale sv

  // Grouper par semaine
  const groupByWeek = (list: Slot[]) => list.reduce<Record<string, Slot[]>>((acc, s) => {
    const d = new Date(s.date + 'T12:00:00')
    const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay()+6)%7))
    const key = mon.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const futureSlots  = slots.filter(s => s.date >= todayStr)
  // Historique : inverser l'ordre (plus récents en premier)
  const pastSlots    = slots.filter(s => s.date <  todayStr).slice().reverse()
  const grouped      = groupByWeek(futureSlots)
  const groupedPast  = groupByWeek(pastSlots)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-texte mb-1">Créneaux</h2>
          <p className="text-texte/50 text-sm">{slots.filter(s=>s.status==='available').length} disponibles · {slots.filter(s=>s.status==='booked').length} réservés</p>
        </div>
        {msg && <span className="text-sm bg-vert-pastel/30 text-texte px-4 py-2 rounded-xl">{msg}</span>}
      </div>

      {/* Onglets */}
      <div className="flex gap-1 bg-blanc-casse rounded-xl p-1 w-fit flex-wrap">
        {([
          ['list',     `📋 À venir (${futureSlots.length})`],
          ['history',  `📁 Historique (${pastSlots.length})`],
          ['generate', '⚡ Générer'],
          ['add',      '➕ Ajouter'],
        ] as [Tab,string][]).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t?'bg-white shadow text-rose-saumon':'text-texte/50 hover:text-texte'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Rendu d'une liste de créneaux (réutilisé pour liste + historique) ── */}
      {(tab === 'list' || tab === 'history') && (() => {
        const isHistory  = tab === 'history'
        const groupedMap = isHistory ? groupedPast : grouped
        const emptyMsg   = isHistory ? 'Aucun créneau passé.' : 'Aucun créneau à venir. Utilisez "Générer" ou "Ajouter".'

        return (
          <div className="space-y-6">
            {loading && <p className="text-center text-texte/40 py-10">Chargement…</p>}
            {!loading && Object.keys(groupedMap).length === 0 && (
              <div className="text-center py-16 text-texte/40">
                <p className="text-4xl mb-3">{isHistory ? '📁' : '📭'}</p>
                <p>{emptyMsg}</p>
              </div>
            )}
            {Object.entries(groupedMap).map(([week, weekSlots]) => (
              <div key={week}>
                <p className="text-xs font-semibold text-texte/40 uppercase tracking-wider mb-2">
                  Semaine du {week}
                </p>
                <div className="space-y-2">
                  {weekSlots.map(slot => {
                    const d = new Date(slot.date+'T12:00:00')
                    const dayLabel = d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'short' })
                    const isBooked  = slot.status === 'booked'
                    const rowStyle  = isBooked
                      ? { borderColor: 'rgba(228,161,137,0.4)', opacity: 0.8 }
                      : isHistory
                        ? { borderColor: 'rgba(200,200,200,0.4)', backgroundColor: '#fafafa', opacity: 0.65 }
                        : { borderColor: '#add3a0', backgroundColor: 'rgba(173,211,160,0.12)' }
                    return (
                      <div key={slot.id}
                        className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 border"
                        style={rowStyle}>
                        <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 items-center">
                          <span className="font-medium text-texte capitalize text-sm">{dayLabel}</span>
                          <span className="text-texte/70 text-sm">{slot.startTime} – {slot.endTime}</span>
                          <span className="text-texte/50 text-xs">{slot.durationMinutes} min</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            slot.location==='Visio' ? 'bg-vert-pastel/30 text-texte' :
                            slot.location==='Lyon'  ? 'bg-rose-pastel/30 text-texte' :
                            'bg-rose-saumon/20 text-texte'}`}>
                            📍 {slot.location}
                          </span>
                          {slot.allowVisio && slot.location !== 'Visio' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-vert-pastel/20 text-texte/60">💻 Visio possible</span>
                          )}
                          {isBooked && (
                            <span className="text-xs text-rose-saumon font-medium">✅ {slot.clientName}</span>
                          )}
                        </div>
                        {!isHistory && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isBooked && (
                              <button onClick={() => releaseSlot(slot.id)}
                                className="text-xs px-2.5 py-1 rounded-lg border border-vert-pastel/60 text-texte/50 hover:bg-vert-pastel/20 hover:text-texte transition-colors"
                                title="Libérer ce créneau (annulation)">
                                🔓 Libérer
                              </button>
                            )}
                            {!isBooked && (
                              <button onClick={() => deleteSlot(slot.id)}
                                className="text-texte/20 hover:text-red-400 transition-colors text-lg"
                                title="Supprimer">
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      {/* ── GÉNÉRATEUR ── */}
      {tab === 'generate' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-texte">Générer des créneaux sur une période</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-texte/60 mb-1">Date de début</label>
              <input type="date" value={gen.startDate} onChange={e=>setGen({...gen,startDate:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-sm text-texte/60 mb-1">Date de fin</label>
              <input type="date" value={gen.endDate} onChange={e=>setGen({...gen,endDate:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-texte/60 mb-2">Jours</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS_FR.map((d,i)=>(
                <button key={i} onClick={()=>setGen(g=>({...g, days: g.days.includes(i)?g.days.filter(x=>x!==i):[...g.days,i].sort()}))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${gen.days.includes(i)?'bg-rose-saumon text-white':'bg-blanc-casse text-texte/50 border border-rose-pastel/30'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-texte/60 mb-1">Début créneaux</label>
              <input type="time" value={gen.startTime} onChange={e=>setGen({...gen,startTime:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-sm text-texte/60 mb-1">Fin créneaux</label>
              <input type="time" value={gen.endTime} onChange={e=>setGen({...gen,endTime:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-sm text-texte/60 mb-1">Durée (min)</label>
              <select value={gen.durationMinutes} onChange={e=>setGen({...gen,durationMinutes:Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon bg-white">
                {DURATIONS.map(d=><option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-texte/60 mb-1">Lieu</label>
              <select value={gen.location} onChange={e=>setGen({...gen,location:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon bg-white">
                {LOCATIONS.map(l=><option key={l} value={l}>{l==='Lyon'?'📍 Présentiel Lyon':l==='Giez'?'📍 Présentiel Giez':'💻 Visio uniquement'}</option>)}
              </select>
            </div>
            {gen.location !== 'Visio' && (
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-texte cursor-pointer">
                  <input type="checkbox" checked={gen.allowVisio} onChange={e=>setGen({...gen,allowVisio:e.target.checked})} className="accent-rose-saumon w-4 h-4" />
                  Proposer aussi la visio pour ces créneaux
                </label>
              </div>
            )}
          </div>

          <button onClick={generate} disabled={loading||!gen.startDate||!gen.endDate}
            className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Génération…' : '⚡ Générer les créneaux'}
          </button>
        </div>
      )}

      {/* ── AJOUT UNIQUE ── */}
      {tab === 'add' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-texte">Ajouter un créneau unique</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-texte/60 mb-1">Date</label>
              <input type="date" value={single.date} min={todayStr} onChange={e=>setSingle({...single,date:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-sm text-texte/60 mb-1">Heure de début</label>
              <input type="time" value={single.startTime} onChange={e=>setSingle({...single,startTime:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon" />
            </div>
            <div>
              <label className="block text-sm text-texte/60 mb-1">Durée (min)</label>
              <select value={single.durationMinutes} onChange={e=>setSingle({...single,durationMinutes:Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon bg-white">
                {DURATIONS.map(d=><option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-texte/60 mb-1">Lieu</label>
              <select value={single.location} onChange={e=>setSingle({...single,location:e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon bg-white">
                {LOCATIONS.map(l=><option key={l} value={l}>{l==='Lyon'?'📍 Présentiel Lyon':l==='Giez'?'📍 Présentiel Giez':'💻 Visio uniquement'}</option>)}
              </select>
            </div>
            {single.location !== 'Visio' && (
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-texte cursor-pointer">
                  <input type="checkbox" checked={single.allowVisio} onChange={e=>setSingle({...single,allowVisio:e.target.checked})} className="accent-rose-saumon w-4 h-4" />
                  Proposer aussi la visio
                </label>
              </div>
            )}
          </div>
          <button onClick={addSingle} disabled={loading||!single.date}
            className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Ajout…' : '➕ Ajouter ce créneau'}
          </button>
        </div>
      )}
    </div>
  )
}
