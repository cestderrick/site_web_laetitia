import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Laetitia Chastel – Sophrologue & Coach à Lyon',
  description:
    'Accompagnement en sophrologie et coaching à Lyon (Bellecour). Gestion du stress, transitions de vie, développement personnel. Séances individuelles et en groupe.',
  keywords: [
    'sophrologue Lyon',
    'coach Lyon',
    'sophrologie Lyon Bellecour',
    'coaching Lyon',
    'gestion stress Lyon',
    'sophrologie caycédienne Lyon',
    'développement personnel Lyon',
    'Laetitia Chastel sophrologue',
  ],
  authors: [{ name: 'Laetitia Chastel' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.sophrocoachinglaetitia.com', // ← mettre le futur domaine
    title: 'Laetitia Chastel – Sophrologue & Coach à Lyon',
    description:
      'Sophrologie et coaching à Lyon. Prenez soin de vous avec un accompagnement sur mesure.',
    siteName: 'P.ose – Sophrologie & Coaching',
    images: [{ url: '/logos/LOGO ROSE SAUMON.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laetitia Chastel – Sophrologue & Coach à Lyon',
    description: 'Sophrologie et coaching à Lyon. Accompagnement sur mesure.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        {/* Schema.org LocalBusiness – SEO local Lyon */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'P.ose – Sophrologie & Coaching',
              description:
                'Accompagnement en sophrologie caycédienne et coaching à Lyon.',
              url: 'https://www.sophrocoachinglaetitia.com',
              telephone: '+33664438747',
              email: 'sophrocoachinglaetitia@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '29 place Bellecour',
                addressLocality: 'Lyon',
                postalCode: '69002',
                addressCountry: 'FR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 45.757813,
                longitude: 4.832011,
              },
              openingHoursSpecification: [],
              sameAs: [
                'https://www.instagram.com/laeti.sophrocoach/',
                'https://www.linkedin.com/in/laetitia-chastel/',
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
