import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EntreprisesContent from '@/components/sections/EntreprisesContent'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-web-laetitia.onrender.com'

export const metadata: Metadata = {
  title: 'Sophrologie & Coaching en Entreprise à Lyon – P.ose',
  description:
    "Ateliers de sophrologie, coaching d'équipe et conférences bien-être pour entreprises à Lyon et en visio. Réduction du stress, cohésion d'équipe, prévention du burn-out. Devis gratuit.",
  keywords: [
    'sophrologie entreprise Lyon',
    'coaching entreprise Lyon',
    'bien-être au travail Lyon',
    'atelier sophrologie équipe Lyon',
    'gestion stress entreprise Lyon',
    'prévention burn-out Lyon',
    'sophrologue entreprise Lyon',
    'coaching équipe Lyon',
  ],
  alternates: { canonical: `${SITE_URL}/entreprises` },
  openGraph: {
    type:        'website',
    url:         `${SITE_URL}/entreprises`,
    title:       'Sophrologie & Coaching en Entreprise à Lyon – P.ose',
    description: "Ateliers sophrologie, coaching d'équipe et conférences bien-être à Lyon. Devis gratuit.",
  },
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil',      item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Entreprises',  item: `${SITE_URL}/entreprises` },
  ],
}

export default function EntreprisesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />
      <main>
        <EntreprisesContent />
      </main>
      <Footer />
    </>
  )
}
