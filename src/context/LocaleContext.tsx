'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type Locale = 'fr' | 'en' | 'es'

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

/** Préfixe d'URL selon la locale ('fr' → '', 'en' → '/en', 'es' → '/es') */
export function localePrefix(locale: Locale): string {
  return locale === 'fr' ? '' : `/${locale}`
}

const LocaleContext = createContext<Locale>('fr')

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}
