'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Consent = 'accepted' | 'refused' | null

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null)
  const [visible, setVisible]  = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent') as Consent
    if (!stored) setVisible(true)
    else setConsent(stored)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setConsent('accepted')
    setVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused')
    setConsent('refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-texte text-blanc-casse p-6 md:p-8 shadow-2xl"
    >
      <div className="container-max flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <p className="font-heading text-lg mb-1">Ce site utilise des cookies 🍪</p>
          <p className="text-blanc-casse/70 text-sm leading-relaxed">
            Nous utilisons des cookies techniques indispensables au bon fonctionnement du site,
            et des cookies analytiques anonymes pour améliorer votre expérience.{' '}
            <Link href="/politique-cookies" className="underline hover:text-rose-saumon transition-colors">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleRefuse}
            className="px-5 py-2.5 rounded-full border border-blanc-casse/30 text-sm hover:border-blanc-casse/60 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary !py-2.5 !px-5 text-sm"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
