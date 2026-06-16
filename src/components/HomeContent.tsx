'use client'

import { useContentReady } from '@/hooks/useContent'
import Hero           from '@/components/sections/Hero'
import QuiSuisJe      from '@/components/sections/QuiSuisJe'
import Vision         from '@/components/sections/Vision'
import Methodes       from '@/components/sections/Methodes'
import QuiSection     from '@/components/sections/QuiSection'
import Avis           from '@/components/sections/Avis'
import ContactSection from '@/components/sections/ContactSection'

export default function HomeContent() {
  const ready = useContentReady()

  return (
    <main
      style={{
        opacity:    ready ? 1 : 0,
        transition: ready ? 'opacity 0.3s ease' : 'none',
      }}
    >
      <Hero />
      <QuiSuisJe />
      <Vision />
      <Methodes />
      <QuiSection />
      <Avis />
      <ContactSection />
    </main>
  )
}
