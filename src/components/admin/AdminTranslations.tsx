'use client'

import { useState, useEffect } from 'react'
import { useRawContent } from '@/hooks/useContent'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

// Champs à exclure des traductions (ne sont pas du texte visible)
const SKIP_PATTERNS = [
  '__en', '__es',           // champs de traduction eux-mêmes
  'instagram', 'linkedin', // URLs
  'photo', 'image', 'url', // médias
  'couleur', 'taille', 'align', // styles
  '_history',              // historique
]
function isSkipped(field: string) {
  return SKIP_PATTERNS.some(p => field.includes(p))
}

type Locale = 'en' | 'es'
type TranslationState = Record<string, Record<string, Record<Locale, string>>>
// structure: section → field → locale → valeur

async function translateText(adminKey: string, text: string, to: Locale): Promise<string> {
  const resp = await fetch(`${BACKEND}/api/admin/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ text, from: 'fr', to }),
  })
  if (!resp.ok) throw new Error((await resp.json()).error || 'Erreur traduction')
  const d = await resp.json()
  return d.translated || ''
}

async function saveTranslations(adminKey: string, content: Record<string, Record<string, string>>) {
  const resp = await fetch(`${BACKEND}/api/admin/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ content }),
  })
  if (!resp.ok) throw new Error((await resp.json()).error || 'Erreur sauvegarde')
}

const LANG_LABEL: Record<Locale, string> = { en: '🇬🇧 Anglais', es: '🇪🇸 Espagnol' }

export default function AdminTranslations({ adminKey }: { adminKey: string }) {
  const raw = useRawContent()
  const [translations, setTranslations] = useState<TranslationState>({})
  const [translating, setTranslating]   = useState<Record<string, boolean>>({})
  const [saving, setSaving]             = useState(false)
  const [savedMsg, setSavedMsg]         = useState('')
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  // Initialiser depuis raw content
  useEffect(() => {
    if (!Object.keys(raw).length) return
    const init: TranslationState = {}
    for (const [section, fields] of Object.entries(raw)) {
      init[section] = {}
      for (const [field, value] of Object.entries(fields)) {
        if (isSkipped(field)) continue
        init[section][field] = {
          en: fields[`${field}__en`] || '',
          es: fields[`${field}__es`] || '',
        }
      }
    }
    setTranslations(init)
  }, [raw])

  function setVal(section: string, field: string, locale: Locale, val: string) {
    setTranslations(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: { ...prev[section]?.[field], [locale]: val },
      },
    }))
  }

  /** Auto-traduit un seul champ */
  async function translateField(section: string, field: string) {
    const frText = raw[section]?.[field] || ''
    if (!frText.trim()) return
    const key = `${section}.${field}`
    setTranslating(t => ({ ...t, [key]: true }))
    try {
      const [en, es] = await Promise.all([
        translateText(adminKey, frText, 'en'),
        translateText(adminKey, frText, 'es'),
      ])
      setTranslations(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: { en, es },
        },
      }))
    } catch (e: any) {
      alert(`Erreur traduction ${key} : ${e.message}`)
    } finally {
      setTranslating(t => ({ ...t, [key]: false }))
    }
  }

  /** Auto-traduit toute une section */
  async function translateSection(section: string) {
    const fields = Object.keys(translations[section] || {})
    for (const field of fields) {
      await translateField(section, field)
    }
  }

  /** Auto-traduit tout */
  async function translateAll() {
    for (const section of Object.keys(translations)) {
      await translateSection(section)
    }
  }

  /** Sauvegarder toutes les traductions dans le Sheet */
  async function save() {
    setSaving(true)
    setSavedMsg('')
    try {
      // Construire le patch : seulement les champs __en/__es
      const patch: Record<string, Record<string, string>> = {}
      for (const [section, fields] of Object.entries(translations)) {
        patch[section] = {}
        for (const [field, locales] of Object.entries(fields)) {
          if (locales.en !== undefined) patch[section][`${field}__en`] = locales.en
          if (locales.es !== undefined) patch[section][`${field}__es`] = locales.es
        }
      }
      await saveTranslations(adminKey, patch)
      setSavedMsg('✅ Traductions sauvegardées !')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e: any) {
      alert(`Erreur sauvegarde : ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const sections = Object.keys(translations)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl text-texte font-semibold">Traductions</h2>
          <p className="text-texte/50 text-sm mt-0.5">
            Traduisez automatiquement ou éditez manuellement les textes en anglais et espagnol.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={translateAll}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-vert-pastel/30 text-texte text-sm hover:bg-vert-pastel/50 transition-colors disabled:opacity-40"
          >
            🌐 Tout auto-traduire
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-rose-saumon text-white text-sm hover:bg-rose-saumon/80 transition-colors disabled:opacity-40"
          >
            {saving ? 'Sauvegarde…' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-vert-pastel/20 border border-vert-pastel/40 rounded-xl px-4 py-3 text-sm text-texte">
          {savedMsg}
        </div>
      )}

      {/* Onglets langue */}
      <div className="flex gap-2">
        {(['en', 'es'] as Locale[]).map(loc => (
          <button
            key={loc}
            onClick={() => setActiveLocale(loc)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLocale === loc
                ? 'bg-rose-pastel/40 text-texte'
                : 'text-texte/50 hover:text-texte'
            }`}
          >
            {LANG_LABEL[loc]}
          </button>
        ))}
      </div>

      {/* Sections */}
      {sections.map(section => {
        const fields = Object.entries(translations[section] || {})
        if (!fields.length) return null
        const isOpen = openSections[section] !== false // ouvert par défaut
        const allTranslated = fields.every(([, l]) => l[activeLocale]?.trim())
        return (
          <div key={section} className="border border-rose-pastel/30 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-pastel/10">
              <button
                className="flex items-center gap-3 flex-1 text-left"
                onClick={() => setOpenSections(s => ({ ...s, [section]: !isOpen }))}
              >
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                <span className="font-medium text-texte capitalize">{section}</span>
                {!allTranslated && (
                  <span className="text-xs px-2 py-0.5 bg-rose-saumon/20 text-rose-saumon rounded-full">
                    À compléter
                  </span>
                )}
              </button>
              <button
                onClick={() => translateSection(section)}
                className="text-xs px-3 py-1.5 rounded-lg bg-blanc-casse border border-vert-pastel/40 text-texte/60 hover:text-texte hover:border-vert-pastel transition-colors"
              >
                🌐 Section
              </button>
            </div>

            {isOpen && (
              <div className="divide-y divide-rose-pastel/20">
                {fields.map(([field, locales]) => {
                  const frText = raw[section]?.[field] || ''
                  const translKey = `${section}.${field}`
                  const isLoading = translating[translKey]
                  return (
                    <div key={field} className="px-5 py-4 grid gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-texte/40 mb-1">{field}</p>
                          <p className="text-sm text-texte/60 bg-blanc-casse rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap">
                            {frText || <span className="italic text-texte/30">Vide</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => translateField(section, field)}
                          disabled={isLoading || !frText.trim()}
                          title="Auto-traduire ce champ"
                          className="shrink-0 mt-5 w-8 h-8 flex items-center justify-center rounded-lg bg-vert-pastel/20 hover:bg-vert-pastel/40 text-texte/60 transition-colors disabled:opacity-30"
                        >
                          {isLoading ? (
                            <span className="text-xs animate-spin">⟳</span>
                          ) : (
                            <span className="text-xs">🌐</span>
                          )}
                        </button>
                      </div>
                      <div>
                        <label className="text-xs text-texte/40 mb-1 block">
                          {LANG_LABEL[activeLocale]}
                        </label>
                        <textarea
                          value={locales[activeLocale] || ''}
                          onChange={e => setVal(section, field, activeLocale, e.target.value)}
                          rows={frText.length > 100 ? 3 : 2}
                          className="w-full rounded-xl border border-rose-pastel/30 bg-white px-3 py-2 text-sm text-texte resize-none focus:outline-none focus:border-rose-saumon/50 transition-colors"
                          placeholder={`Traduction ${activeLocale === 'en' ? 'anglaise' : 'espagnole'}…`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
