import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-web-laetitia.onrender.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Laetitia Chastel – Sophrologue & Coach certifiée EMCC à Lyon',
    template: '%s | P.ose – Sophrologie & Coaching Lyon',
  },
  description:
    'Sophrologue et coach certifiée EMCC à Lyon (Bellecour) et Giez (Annecy), et en visio. Gestion du stress, transitions de vie, développement personnel. Séances individuelles et collectives.',
  keywords: [
    'sophrologue Lyon',
    'coach Lyon',
    'sophrologie Lyon Bellecour',
    'coaching Lyon',
    'gestion stress Lyon',
    'sophrologie caycédienne Lyon',
    'développement personnel Lyon',
    'Laetitia Chastel sophrologue',
    'coach certifié EMCC Lyon',
    'sophrologue Giez Annecy',
    'sophrologie en ligne',
    'coaching transitions professionnelles',
  ],
  authors:  [{ name: 'Laetitia Chastel', url: SITE_URL }],
  creator:  'Laetitia Chastel',
  publisher:'P.ose – Sophrologie & Coaching',
  category: 'health',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type:        'website',
    locale:      'fr_FR',
    url:         SITE_URL,
    title:       'Laetitia Chastel – Sophrologue & Coach certifiée EMCC à Lyon',
    description: 'Sophrologie caycédienne et coaching à Lyon, Giez et en visio. Un espace bienveillant pour révéler vos ressources.',
    siteName:    'P.ose – Sophrologie & Coaching',
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    'P.ose – Sophrologie & Coaching Lyon – Laetitia Chastel',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Laetitia Chastel – Sophrologue & Coach à Lyon',
    description: 'Sophrologie et coaching à Lyon, Giez et en visio. Prenez soin de vous.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
      '@id':   `${SITE_URL}/#business`,
      name:    'P.ose – Sophrologie & Coaching',
      description: 'Sophrologue certifiée Sophrologie Caycédienne et coach certifiée EMCC. Accompagnement individuel et collectif pour la gestion du stress, les transitions de vie et le développement personnel.',
      url:      SITE_URL,
      telephone:'+33664438747',
      email:    'sophrocoachinglaetitia@gmail.com',
      image:    `${SITE_URL}/laetitia.webp`,
      logo:     `${SITE_URL}/logos/LOGO ROSE SAUMON.png`,
      priceRange: '€€',
      address: {
        '@type':          'PostalAddress',
        streetAddress:    '29 place Bellecour',
        addressLocality:  'Lyon',
        addressRegion:    'Auvergne-Rhône-Alpes',
        postalCode:       '69002',
        addressCountry:   'FR',
      },
      geo: {
        '@type':     'GeoCoordinates',
        latitude:    45.757813,
        longitude:   4.832011,
      },
      hasMap: 'https://www.google.com/maps/place/?q=place_id:ChIJR2xafuDr9EcRRioXLswDybg',
      areaServed: [
        { '@type': 'City', name: 'Lyon' },
        { '@type': 'City', name: 'Giez' },
        { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
      ],
      sameAs: [
        'https://www.instagram.com/laeti.sophrocoach/',
        'https://www.linkedin.com/in/laetitia-chastel/',
        'https://www.google.com/maps/place/?q=place_id:ChIJR2xafuDr9EcRRioXLswDybg',
      ],
      makesOffer: [
        {
          '@type':       'Offer',
          name:          'Séance de sophrologie individuelle',
          description:   'Séance individuelle de sophrologie caycédienne pour la gestion du stress, préparation mentale ou accompagnement de la douleur.',
          areaServed:    ['Lyon', 'Giez', 'En visio'],
        },
        {
          '@type':       'Offer',
          name:          'Coaching individuel',
          description:   'Coaching certifié EMCC pour transitions professionnelles, confiance en soi et développement personnel.',
          areaServed:    ['Lyon', 'En visio'],
        },
        {
          '@type':       'Offer',
          name:          'Sophrologie et coaching en entreprise',
          description:   'Ateliers collectifs, programmes bien-être et conférences pour entreprises à Lyon et en visio.',
          areaServed:    ['Lyon', 'En visio'],
        },
      ],
    },
    {
      '@type':    'Person',
      '@id':      `${SITE_URL}/#person`,
      name:       'Laetitia Chastel',
      jobTitle:   'Sophrologue & Coach certifiée EMCC',
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
    },
    {
      '@type':        'WebSite',
      '@id':          `${SITE_URL}/#website`,
      url:            SITE_URL,
      name:           'P.ose – Sophrologie & Coaching',
      description:    'Site officiel de Laetitia Chastel, sophrologue et coach certifiée EMCC à Lyon.',
      inLanguage:     'fr-FR',
      publisher:      { '@id': `${SITE_URL}/#business` },
      potentialAction: {
        '@type':  'SearchAction',
        target:   `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
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
