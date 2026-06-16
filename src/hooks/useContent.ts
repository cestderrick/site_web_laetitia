'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export type ContentMap = Record<string, Record<string, string>>

/** Fetch le contenu depuis le backend (lecture publique) */
export function useContent(): ContentMap {
  const [content, setContent] = useState<ContentMap>({})
  useEffect(() => {
    fetch(`${BACKEND}/api/admin/content`)
      .then(r => r.json())
      .then(setContent)
      .catch(() => {})
  }, [])
  return content
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

/** URL d'une image stockée (gère les chemins /uploads relatifs au backend) */
export function imgSrc(src: string): string {
  if (!src) return ''
  return src.startsWith('/uploads') ? `${BACKEND}${src}` : src
}
