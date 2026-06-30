'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useLocale, type Locale } from '@/context/LocaleContext'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export type ContentMap = Record<string, Record<string, string>>

/** Construit une ContentMap localisée : préfère field__en/field__es, sinon FR */
function localizeContent(raw: ContentMap, locale: Locale): ContentMap {
  if (locale === 'fr') return raw
  const result: ContentMap = {}
  for (const [section, fields] of Object.entries(raw)) {
    result[section] = {}
    for (const [field, value] of Object.entries(fields)) {
      if (field.includes('__')) continue // champs de traduction bruts ignorés
      const localKey = `${field}__${locale}`
      const localVal = fields[localKey]
      result[section][field] = (localVal !== undefined && localVal !== null && localVal !== '')
        ? localVal
        : value
    }
  }
  return result
}

// Cache module-level : tous les composants partagent le même fetch
let _cache:   ContentMap | null = null
let _promise: Promise<ContentMap> | null = null
let _ready    = false   // true dès que le premier fetch s'est terminé (succès ou erreur)

function fetchContent(): Promise<ContentMap> {
  if (_cache) return Promise.resolve(_cache)
  if (_promise) return _promise
  _promise = fetch(`${BACKEND}/api/admin/content`, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then((data: ContentMap) => {
      _cache = data
      _ready = true
      return data
    })
    .catch(err => {
      console.warn('[useContent] fetch failed, using defaults.', err?.message)
      _promise = null
      _ready = true
      return {} as ContentMap
    })
  return _promise
}

/** Invalide le cache (utile après un save admin) */
export function invalidateContent() {
  _cache   = null
  _promise = null
  _ready   = false
}

/** Hook React — retourne le contenu depuis le Sheet, localisé selon le LocaleContext */
export function useContent(): ContentMap {
  const locale  = useLocale()
  const [raw, setRaw] = useState<ContentMap>(_cache || {})

  useEffect(() => {
    if (_cache) { setRaw(_cache); return }
    fetchContent().then(data => { if (data && Object.keys(data).length) setRaw(data) })
  }, [])

  return localizeContent(raw, locale)
}

/** Hook interne admin : retourne le contenu brut complet (toutes langues) */
export function useRawContent(): ContentMap {
  const [raw, setRaw] = useState<ContentMap>(_cache || {})
  useEffect(() => {
    if (_cache) { setRaw(_cache); return }
    fetchContent().then(data => { if (data && Object.keys(data).length) setRaw(data) })
  }, [])
  return raw
}

/**
 * Retourne true une fois que le fetch initial est terminé.
 * Permet d'éviter d'afficher les textes par défaut le temps du chargement.
 */
export function useContentReady(): boolean {
  const [ready, setReady] = useState(_ready)
  useEffect(() => {
    if (_ready) { setReady(true); return }
    fetchContent().then(() => setReady(true))
  }, [])
  return ready
}

/** Récupère une valeur texte, avec fallback */
export function cs(content: ContentMap, section: string, field: string, fallback = ''): string {
  // ?? (et non ||) : fallback uniquement si undefined/null, pas si chaîne vide intentionnelle
  const val = content[section]?.[field]
  return val !== undefined && val !== null ? val : fallback
}

/** Retourne les styles inline couleur + taille si définis dans le Sheet */
export function applyStyle(content: ContentMap, section: string, field: string): CSSProperties {
  const color    = content[section]?.[`${field}_color`]
  const fontSize = content[section]?.[`${field}_size`]
  return {
    ...(color    ? { color }    : {}),
    ...(fontSize ? { fontSize } : {}),
  }
}

/**
 * Retourne l'alignement texte.
 * - Sans `field` : lit `_align` (niveau section, rétro-compat)
 * - Avec `field`  : lit `_align_fieldKey` (niveau champ — prioritaire)
 */
export function getAlign(content: ContentMap, section: string, field?: string): CSSProperties {
  const key   = field ? `_align_${field}` : '_align'
  const align = content[section]?.[key]
  if (align === 'left')    return { textAlign: 'left' }
  if (align === 'right')   return { textAlign: 'right' }
  if (align === 'justify') return { textAlign: 'justify' }
  if (align === 'center')  return { textAlign: 'center' }
  return {}
}

/** URL d'une image stockée (gère les chemins /uploads relatifs au backend) */
export function imgSrc(src: string): string {
  if (!src) return ''
  return src.startsWith('/uploads') ? `${BACKEND}${src}` : src
}

/**
 * Convertit un texte en HTML sûr avec support des sauts de ligne.
 * - Les retours à la ligne (Enter dans le textarea) → <br>
 * - Les balises <br> ou <br/> littérales → <br>
 * - Tout autre HTML est échappé (pas de XSS)
 * Usage : <p dangerouslySetInnerHTML={renderRich(texte)} />
 */
export function renderRich(text: string): { __html: string } {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const withBr = escaped
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')  // restaure <br> échappés
    .replace(/\n/g, '<br>')                  // convertit les \n
  return { __html: withBr }
}
