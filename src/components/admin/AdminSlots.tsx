'use client'

import { useEffect, useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

const DAYS = [
  { value: 0, label: 'Dim' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
]

type SeanceType = {
  id: string
  label: string
  emoji: string
  mode: 'presentiel' | 'visio'
  adresse?: string
  active: boolean
}

type Config = {
  slotDurationMinutes: number
  availabilityStart: string
  availabilityEnd: string
  availabilityDays: number[]
  types: SeanceType[]
}

export default function AdminSlots({ adminKey }: { adminKey: string }) {
  const [config,  setConfig]  = useState<Config | null>(null)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/api/admin/slots-config`, { headers: { 'x-admin-key': adminKey } })
      .then(r => r.json())
      .then(setConfig)
  }, [adminKey])

  const save = async () => {
    setLoading(true)
    await fetch(`${BACKEND}/api/admin/slots-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(config),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  const toggleDay = (d: number) => {
    if (!config) return
    const days = config.availabilityDays.includes(d)
      ? config.availabilityDays.filter(x => x !== d)
      : [...config.availabilityDays, d].sort()
    setConfig({ ...config, availabilityDays: days })
  }

  const updateType = (idx: number, patch: Partial<SeanceType>) => {
    if (!config) return
    const types = config.types.map((t, i) => i === idx ? { ...t, ...patch } : t)
    setConfig({ ...config, types })
  }

  const addType = () => {
    if (!config) return
    const newType: SeanceType = {
      id: `type-${Date.now()}`,
      label: 'Nouvelle séance',
      emoji: '✨',
      mode: 'presentiel',
      active: true,
    }
    setConfig({ ...config, types: [...config.types, newType] })
  }

  const removeType = (idx: number) => {
    if (!config) return
    setConfig({ ...config, types: config.types.filter((_, i) => i !== idx) })
  }

  if (!config) return <div className="text-center py-20 text-texte/40">Chargement…</div>

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl text-texte mb-1">Créneaux de disponibilité</h2>
        <p className="text-texte/50 text-sm">Définissez vos horaires et jours de disponibilité.</p>
      </div>

      {/* Horaires */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="font-semibold text-texte">Horaires</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-texte/60 mb-1">Début</label>
            <input
              type="time"
              value={config.availabilityStart}
              onChange={e => setConfig({ ...config, availabilityStart: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte"
            />
          </div>
          <div>
            <label className="block text-sm text-texte/60 mb-1">Fin</label>
            <input
              type="time"
              value={config.availabilityEnd}
              onChange={e => setConfig({ ...config, availabilityEnd: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte"
            />
          </div>
          <div>
            <label className="block text-sm text-texte/60 mb-1">Durée (minutes)</label>
            <input
              type="number"
              min={30} max={120} step={15}
              value={config.slotDurationMinutes}
              onChange={e => setConfig({ ...config, slotDurationMinutes: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte"
            />
          </div>
        </div>

        {/* Jours */}
        <div>
          <label className="block text-sm text-texte/60 mb-2">Jours disponibles</label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map(d => (
              <button
                key={d.value}
                onClick={() => toggleDay(d.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  config.availabilityDays.includes(d.value)
                    ? 'bg-rose-saumon text-white'
                    : 'bg-blanc-casse text-texte/50 border border-rose-pastel/30'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Types de séance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-texte">Types de séance</h3>
          <button
            onClick={addType}
            className="text-sm text-rose-saumon border border-rose-saumon/30 px-3 py-1.5 rounded-lg hover:bg-rose-saumon/5 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        <div className="space-y-4">
          {config.types.map((t, idx) => (
            <div
              key={t.id}
              className={`border rounded-xl p-4 transition-opacity ${t.active ? '' : 'opacity-50'}`}
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-texte/50 mb-1">Libellé</label>
                  <input
                    type="text"
                    value={t.label}
                    onChange={e => updateType(idx, { label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-rose-pastel/30 text-sm focus:outline-none focus:border-rose-saumon"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-texte/50 mb-1">Mode</label>
                    <select
                      value={t.mode}
                      onChange={e => updateType(idx, { mode: e.target.value as 'presentiel' | 'visio' })}
                      className="w-full px-3 py-2 rounded-lg border border-rose-pastel/30 text-sm focus:outline-none focus:border-rose-saumon bg-white"
                    >
                      <option value="presentiel">📍 Présentiel</option>
                      <option value="visio">💻 Visio</option>
                    </select>
                  </div>
                  <div className="w-16">
                    <label className="block text-xs text-texte/50 mb-1">Emoji</label>
                    <input
                      type="text"
                      value={t.emoji}
                      maxLength={2}
                      onChange={e => updateType(idx, { emoji: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-rose-pastel/30 text-center text-lg focus:outline-none"
                    />
                  </div>
                </div>

                {t.mode === 'presentiel' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-texte/50 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={t.adresse || ''}
                      onChange={e => updateType(idx, { adresse: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-rose-pastel/30 text-sm focus:outline-none focus:border-rose-saumon"
                      placeholder="29 place Bellecour, 69002 Lyon"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-rose-pastel/20">
                <label className="flex items-center gap-2 text-sm text-texte/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.active}
                    onChange={e => updateType(idx, { active: e.target.checked })}
                    className="accent-rose-saumon"
                  />
                  Actif (visible sur le site)
                </label>
                <button
                  onClick={() => removeType(idx)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sauvegarder */}
      <div className="flex justify-end">
        <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60 min-w-[160px]">
          {saved ? '✅ Sauvegardé !' : loading ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
