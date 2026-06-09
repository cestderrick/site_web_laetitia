import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EntreprisesContent from '@/components/sections/EntreprisesContent'

export const metadata: Metadata = {
  title: 'Accompagnement Entreprises – Sophrologie & Coaching Lyon | P.ose',
  description:
    "Ateliers de sophrologie et coaching en entreprise à Lyon et en visio. Bien-être au travail, gestion du stress, cohésion d'équipe. Demandez un devis personnalisé.",
  keywords: [
    'sophrologie entreprise Lyon',
    'coaching entreprise Lyon',
    'bien-être au travail Lyon',
    'atelier sophrologie équipe',
    'gestion stress entreprise',
  ],
}

export default function EntreprisesPage() {
  return (
    <>
      <Navbar />
      <main>
        <EntreprisesContent />
      </main>
      <Footer />
    </>
  )
}
