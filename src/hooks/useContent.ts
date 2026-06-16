'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export type ContentMap = Record<string, Record<string, string>>

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

/** Hook React — retourne le contenu depuis le Sheet (avec fallback {} pendant le chargement) */
export function useContent(): ContentMap {
  const [content, setContent] = useState<ContentMap>(_cache || {})

  useEffect(() => {
    if (_cache) { setContent(_cache); return }
    fetchContent().then(data => { if (data && Object.keys(data).length) setContent(data) })
  }, [])

  return content
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
  return content[section]?.[field] || fallback
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
