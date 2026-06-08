import Navbar         from '@/components/Navbar'
import Hero           from '@/components/sections/Hero'
import QuiSuisJe      from '@/components/sections/QuiSuisJe'
import Vision         from '@/components/sections/Vision'
import Methodes       from '@/components/sections/Methodes'
import QuiSection     from '@/components/sections/QuiSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer         from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Accroche */}
        <Hero />
        {/* 2. Qui suis-je ? (Laetitia) */}
        <QuiSuisJe />
        {/* 3. Vision / Philosophie */}
        <Vision />
        {/* 4. Méthodes : Coaching + Sophrologie */}
        <Methodes />
        {/* 5. Pour qui ? (population cible) */}
        <QuiSection />
        {/* 6. Contact */}
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
