'use client'

import { useState, useEffect } from 'react'
import { useRawContent } from '@/hooks/useContent'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const SKIP_PATTERNS = ['__en','__es','instagram','linkedin','photo','image','url','_color','_size','_align','_history','emoji','email','telephone','adresse','_visible']
function isSkipped(field: string) { return SKIP_PATTERNS.some(p => field.includes(p)) }

type Locale = 'en' | 'es'
type TranslationState = Record<string, Record<string, Record<Locale, string>>>

async function translateText(adminKey: string, text: string, to: Locale): Promise<string> {
  const resp = await fetch(`${BACKEND}/api/admin/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ text, from: 'fr', to }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(data.error || 'Erreur traduction')
  return data.translated || ''
}

async function saveTranslations(adminKey: string, fullContent: Record<string, Record<string, string>>) {
  const resp = await fetch(`${BACKEND}/api/admin/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(fullContent),
  })
  if (!resp.ok) throw new Error((await resp.json()).error || 'Erreur sauvegarde')
}

export default function AdminTranslations({ adminKey }: { adminKey: string }) {
  const raw = useRawContent()
  const [translations, setTranslations] = useState<TranslationState>({})
  const [translating, setTranslating]   = useState<Record<string, boolean>>({})
  const [saving, setSaving]             = useState(false)
  const [savedMsg, setSavedMsg]         = useState('')
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [progress, setProgress]         = useState('')
  const [errorMsg, setErrorMsg]         = useState('')

  useEffect(() => {
    if (!Object.keys(raw).length) return
    const init: TranslationState = {}
    for (const [section, fields] of Object.entries(raw)) {
      init[section] = {}
      for (const [field] of Object.entries(fields)) {
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
      [section]: { ...prev[section], [field]: { ...prev[section]?.[field], [locale]: val } },
    }))
  }

  async function translateField(section: string, field: string): Promise<boolean> {
    const frText = raw[section]?.[field] || ''
    if (!frText.trim()) return true
    const key = `${section}.${field}`
    setTranslating(t => ({ ...t, [key]: true }))
    setErrorMsg('')
    try {
      const en = await translateText(adminKey, frText, 'en')
      await sleep(1200)
      const es = await translateText(adminKey, frText, 'es')
      setTranslations(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: { en, es } },
      }))
      return true
    } catch (e: any) {
      setErrorMsg(`Erreur sur ${key} : ${e.message}`)
      return false
    } finally {
      setTranslating(t => ({ ...t, [key]: false }))
    }
  }

  async function translateSection(section: string) {
    setErrorMsg('')
    const fields = Object.keys(translations[section] || {})
    for (let i = 0; i < fields.length; i++) {
      setProgress(`${section} — champ ${i + 1}/${fields.length}`)
      const ok = await translateField(section, fields[i])
      if (!ok) break // stop si erreur (ex : 429)
      if (i < fields.length - 1) await sleep(1500)
    }
    setProgress('')
  }

  async function translateAll() {
    setErrorMsg('')
    const sectionList = Object.keys(translations)
    for (let i = 0; i < sectionList.length; i++) {
      const fields = Object.keys(translations[sectionList[i]] || {})
      for (let j = 0; j < fields.length; j++) {
        setProgress(`${sectionList[i]} — champ ${j + 1}/${fields.length}`)
        const ok = await translateField(sectionList[i], fields[j])
        if (!ok) { setProgress(''); return }
        if (j < fields.length - 1) await sleep(1500)
      }
      if (i < sectionList.length - 1) await sleep(1000)
    }
    setProgress('')
  }

  async function save() {
    setSaving(true)
    setSavedMsg('')
    try {
      const fullContent: Record<string, Record<string, string>> = {}
      for (const [section, fields] of Object.entries(translations)) {
        fullContent[section] = { ...(raw[section] || {}) }
        for (const [field, locales] of Object.entries(fields)) {
          fullContent[section][`${field}__en`] = locales.en ?? ''
          fullContent[section][`${field}__es`] = locales.es ?? ''
        }
      }
      await saveTranslations(adminKey, fullContent)
      setSavedMsg('Traductions sauvegardees !')
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl text-texte font-semibold">Traductions</h2>
          <p className="text-texte/50 text-sm mt-0.5">
            Traduisez automatiquement ou editez manuellement les textes en anglais et espagnol.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={translateAll} disabled={saving} className="px-4 py-2 rounded-lg bg-vert-pastel/30 text-texte text-sm hover:bg-vert-pastel/50 transition-colors disabled:opacity-40">
            Tout auto-traduire
          </button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-rose-saumon text-white text-sm hover:bg-rose-saumon/80 transition-colors disabled:opacity-40">
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {progress && (
        <div className="bg-blanc-casse border border-rose-pastel/30 rounded-xl px-4 py-3 text-sm text-texte/60">
          Traduction en cours : {progress}
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-saumon/10 border border-rose-saumon/40 rounded-xl px-4 py-3 text-sm text-rose-saumon flex items-start justify-between gap-3">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="shrink-0 text-rose-saumon/60 hover:text-rose-saumon text-xs">X</button>
        </div>
      )}

      {savedMsg && (
        <div className="bg-vert-pastel/20 border border-vert-pastel/40 rounded-xl px-4 py-3 text-sm text-texte">
          {savedMsg}
        </div>
      )}

      <div className="flex gap-2">
        {(['en', 'es'] as Locale[]).map(loc => (
          <button key={loc} onClick={() => setActiveLocale(loc)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLocale === loc ? 'bg-rose-pastel/40 text-texte' : 'text-texte/50 hover:text-texte'}`}>
            {loc === 'en' ? 'Anglais' : 'Espagnol'}
          </button>
        ))}
      </div>

      {sections.map(section => {
        const fields = Object.entries(translations[section] || {})
        if (!fields.length) return null
        const isOpen = openSections[section] === true
        const allTranslated = fields.every(([, l]) => l[activeLocale]?.trim())
        return (
          <div key={section} className="border border-rose-pastel/30 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-pastel/10">
              <button className="flex items-center gap-3 flex-1 text-left"
                onClick={() => setOpenSections(s => ({ ...s, [section]: !isOpen }))}>
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>{'>'}</span>
                <span className="font-medium text-texte capitalize">{section}</span>
                {!allTranslated && (
                  <span className="text-xs px-2 py-0.5 bg-rose-saumon/20 text-rose-saumon rounded-full">A completer</span>
                )}
              </button>
              <button onClick={() => translateSection(section)}
                className="text-xs px-3 py-1.5 rounded-lg bg-blanc-casse border border-vert-pastel/40 text-texte/60 hover:text-texte hover:border-vert-pastel transition-colors">
                Auto-traduire section
              </button>
            </div>

            {isOpen && (
              <div className="divide-y divide-rose-pastel/20">
                {fields.map(([field, locales]) => {
                  const frText = raw[section]?.[field] || ''
                  const isLoading = translating[`${section}.${field}`]
                  return (
                    <div key={field} className="px-5 py-4 grid gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-texte/40 mb-1">{field}</p>
                          <p className="text-sm text-texte/60 bg-blanc-casse rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap">
                            {frText || <span className="italic text-texte/30">Vide</span>}
                          </p>
                        </div>
                        <button onClick={() => translateField(section, field)}
                          disabled={isLoading || !frText.trim()}
                          className="shrink-0 mt-5 w-8 h-8 flex items-center justify-center rounded-lg bg-vert-pastel/20 hover:bg-vert-pastel/40 text-texte/60 transition-colors disabled:opacity-30 text-xs">
                          {isLoading ? '...' : 'TR'}
                        </button>
                      </div>
                      <div>
                        <label className="text-xs text-texte/40 mb-1 block">
                          {activeLocale === 'en' ? 'Anglais' : 'Espagnol'}
                        </label>
                        <textarea value={locales[activeLocale] || ''}
                          onChange={e => setVal(section, field, activeLocale, e.target.value)}
                          rows={frText.length > 100 ? 3 : 2}
                          className="w-full rounded-xl border border-rose-pastel/30 bg-white px-3 py-2 text-sm text-texte resize-none focus:outline-none focus:border-rose-saumon/50 transition-colors"
                          placeholder={activeLocale === 'en' ? 'Traduction anglaise...' : 'Traduction espagnole...'}
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
