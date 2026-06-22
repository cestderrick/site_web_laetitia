import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-web-laetitia.onrender.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sophrologue & Coach à Lyon – Laetitia Chastel | P.ose',
    template: '%s | P.ose – Sophrologue & Coach Lyon',
  },
  description:
    'Laetitia Chastel, sophrologue certifiée et coach EMCC à Lyon Bellecour (69002) et en visio. Gestion du stress, transitions de vie, confiance en soi, sophrologie caycédienne. Séance découverte offerte.',
  keywords: [
    'sophrologue Lyon',
    'sophrologue Lyon Bellecour',
    'sophrologie Lyon',
    'coach Lyon',
    'coaching Lyon',
    'sophrologie caycédienne Lyon',
    'coach certifié EMCC Lyon',
    'gestion du stress Lyon',
    'développement personnel Lyon',
    'sophrologie en visio',
    'coaching transitions professionnelles Lyon',
    'sophrologue Giez Annecy',
    'séance sophrologie Lyon',
    'burn-out coach Lyon',
    'confiance en soi Lyon',
  ],
  authors:  [{ name: 'Laetitia Chastel', url: SITE_URL }],
  creator:  'Laetitia Chastel',
  publisher:'P.ose – Sophrologue & Coach Lyon',
  category: 'health',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type:        'website',
    locale:      'fr_FR',
    url:         SITE_URL,
    title:       'Sophrologue & Coach à Lyon – Laetitia Chastel | P.ose',
    description: 'Sophrologue certifiée et coach EMCC à Lyon Bellecour. Sophrologie, coaching individuel et entreprise, en cabinet et en visio.',
    siteName:    'P.ose – Sophrologue & Coach Lyon',
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    'Laetitia Chastel – Sophrologue & Coach Lyon – P.ose',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Sophrologue & Coach à Lyon – Laetitia Chastel',
    description: 'Sophrologie et coaching à Lyon et en visio. Prenez soin de vous.',
    images:      ['/og-image.png'],
  },
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  },
}

// ── JSON-LD : LocalBusiness + FAQ + BreadcrumbList ─────────────────────────
const localBusiness = {
  '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
  '@id':   `${SITE_URL}/#business`,
  name:    'P.ose – Sophrologue & Coach Lyon',
  alternateName: ['P.ose Sophrologie Lyon', 'Laetitia Chastel Sophrologue Lyon'],
  description: 'Sophrologue certifiée Sophrologie Caycédienne et coach certifiée EMCC à Lyon. Accompagnement individuel et collectif pour la gestion du stress, les transitions de vie, la confiance en soi et le développement personnel.',
  url:       SITE_URL,
  telephone: '+33664438747',
  email:     'sophrocoachinglaetitia@gmail.com',
  image:     `${SITE_URL}/laetitia.webp`,
  logo:      `${SITE_URL}/logos/LOGO ROSE SAUMON.png`,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Virement bancaire',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '19:00' },
  ],
  address: {
    '@type':         'PostalAddress',
    streetAddress:   '29 place Bellecour',
    addressLocality: 'Lyon',
    addressRegion:   'Auvergne-Rhône-Alpes',
    postalCode:      '69002',
    addressCountry:  'FR',
  },
  geo: {
    '@type':    'GeoCoordinates',
    latitude:   45.757813,
    longitude:  4.832011,
  },
  hasMap:     'https://www.google.com/maps/place/?q=place_id:ChIJR2xafuDr9EcRRioXLswDybg',
  areaServed: [
    { '@type': 'City',                name: 'Lyon' },
    { '@type': 'City',                name: 'Giez' },
    { '@type': 'AdministrativeArea',  name: 'Auvergne-Rhône-Alpes' },
    { '@type': 'Country',             name: 'France', description: 'Séances en visio sur toute la France' },
  ],
  sameAs: [
    'https://www.instagram.com/laeti.sophrocoach/',
    'https://www.linkedin.com/in/laetitia-chastel/',
    'https://www.google.com/maps/place/?q=place_id:ChIJR2xafuDr9EcRRioXLswDybg',
  ],
  makesOffer: [
    {
      '@type':      'Offer',
      name:         'Séance individuelle de sophrologie à Lyon',
      description:  'Séance de sophrologie caycédienne à Lyon Bellecour ou en visio. Gestion du stress, préparation mentale, accompagnement de la douleur.',
      areaServed:   ['Lyon', 'Giez', 'France (visio)'],
    },
    {
      '@type':      'Offer',
      name:         'Coaching individuel à Lyon',
      description:  'Coaching certifié EMCC à Lyon. Transitions professionnelles, confiance en soi, prise de décision, gestion des émotions.',
      areaServed:   ['Lyon', 'France (visio)'],
    },
    {
      '@type':      'Offer',
      name:         'Sophrologie et coaching en entreprise Lyon',
      description:  'Ateliers collectifs, coaching d\'équipe et conférences bien-être pour entreprises à Lyon et en visio.',
      areaServed:   ['Lyon', 'France (visio)'],
    },
  ],
}

const person = {
  '@type':    'Person',
  '@id':      `${SITE_URL}/#person`,
  name:       'Laetitia Chastel',
  jobTitle:   'Sophrologue & Coach certifiée EMCC à Lyon',
  url:        SITE_URL,
  image:      `${SITE_URL}/laetitia.webp`,
  sameAs: [
    'https://www.instagram.com/laeti.sophrocoach/',
    'https://www.linkedin.com/in/laetitia-chastel/',
  ],
  worksFor: { '@id': `${SITE_URL}/#business` },
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Certification EMCC – JBS Coaching' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Sophrologie Caycédienne' },
  ],
}

const website = {
  '@type':       'WebSite',
  '@id':         `${SITE_URL}/#website`,
  url:           SITE_URL,
  name:          'P.ose – Sophrologue & Coach Lyon',
  description:   'Site officiel de Laetitia Chastel, sophrologue et coach certifiée EMCC à Lyon.',
  inLanguage:    'fr-FR',
  publisher:     { '@id': `${SITE_URL}/#business` },
  potentialAction: {
    '@type':       'SearchAction',
    target:        `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// FAQ Schema — boost majeur pour les rich results Google
const faq = {
  '@type': 'FAQPage',
  '@id':   `${SITE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que la sophrologie et comment peut-elle m\'aider à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La sophrologie caycédienne est une méthode d\'accompagnement qui combine respiration, mouvement doux et évocations positives. À Lyon, Laetitia Chastel propose des séances individuelles de sophrologie pour la gestion du stress, l\'anxiété, la préparation mentale et le développement du bien-être au quotidien.',
      },
    },
    {
      '@type': 'Question',
      name: 'Où se déroulent les séances de sophrologie à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les séances de sophrologie ont lieu au cabinet situé au 29 place Bellecour, Lyon 2ème (69002), facilement accessible depuis toute l\'agglomération lyonnaise. Laetitia propose également des séances en visioconférence pour toute la France.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la différence entre sophrologie et coaching à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La sophrologie travaille sur le corps et la conscience (respiration, relaxation, bien-être) tandis que le coaching est un espace de réflexion orienté action (transitions, objectifs, décision). En tant que sophrologue et coach certifiée EMCC à Lyon, Laetitia Chastel peut combiner les deux approches selon vos besoins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment prendre rendez-vous avec un sophrologue à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vous pouvez prendre rendez-vous directement en ligne via le site P.ose, en choisissant un créneau disponible dans l\'agenda. Les séances durent 60 minutes et se tiennent au 29 place Bellecour à Lyon ou en visioconférence.',
      },
    },
    {
      '@type': 'Question',
      name: 'La sophrologie est-elle remboursée par la mutuelle à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La sophrologie n\'est pas remboursée par la Sécurité Sociale, mais de nombreuses mutuelles prennent en charge tout ou partie des séances de sophrologie. Renseignez-vous auprès de votre complémentaire santé. Une facture peut être fournie à votre demande.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien coûte une séance de sophrologie ou de coaching à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contactez Laetitia Chastel directement pour connaître les tarifs actuels des séances de sophrologie et de coaching à Lyon. Les séances durent 60 minutes, en cabinet au 29 place Bellecour (Lyon 2) ou en visio.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous de la sophrologie ou du coaching en entreprise à Lyon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, P.ose propose des interventions en entreprise à Lyon et dans toute la région Auvergne-Rhône-Alpes : ateliers de sophrologie, coaching d\'équipe, programmes bien-être au travail et conférences sur la gestion du stress. Demandez un devis sur la page Entreprises.',
      },
    },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [localBusiness, person, website, faq],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
