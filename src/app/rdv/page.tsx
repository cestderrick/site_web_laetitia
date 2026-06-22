import type { Metadata } from 'next'
import Navbar                 from '@/components/Navbar'
import Footer                 from '@/components/Footer'
import Link                   from 'next/link'
import GoogleCalendarBooking  from '@/components/GoogleCalendarBooking'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-web-laetitia.onrender.com'

export const metadata: Metadata = {
  title: 'Prendre rendez-vous – Sophrologue & Coach Lyon Bellecour | P.ose',
  description:
    'Réservez votre séance de sophrologie ou de coaching à Lyon (Bellecour) ou en visio avec Laetitia Chastel, sophrologue certifiée et coach EMCC. Créneaux disponibles en ligne.',
  keywords: [
    'rendez-vous sophrologue Lyon',
    'réserver séance sophrologie Lyon',
    'séance coaching Lyon',
    'sophrologie Lyon Bellecour',
    'prendre rdv sophrologue Lyon',
  ],
  alternates: { canonical: `${SITE_URL}/rdv` },
}

export default function RdvPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blanc-casse pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
              Prise de rendez-vous
            </p>
            <h1 className="text-4xl md:text-5xl text-texte mb-4">
              Choisissez votre créneau
            </h1>
            <p className="text-texte/60 text-lg max-w-xl mx-auto leading-relaxed">
              Sélectionnez un créneau disponible dans l'agenda ci-dessous.
              Vous recevrez une confirmation par e-mail après votre réservation.
            </p>
          </div>

          {/* Type de séance */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                titre:    'Séance de Coaching',
                duree:    '60 min',
                desc:     "Un espace de réflexion pour passer de l'intention à l'action. Transition, décision, confiance en soi.",
                couleur:  'border-rose-saumon/40 bg-rose-saumon/5',
              },
              {
                titre:    'Séance de Sophrologie',
                duree:    '60 min',
                desc:     'Respiration, mouvement et évocations positives pour retrouver calme et ressources intérieures.',
                couleur:  'border-vert-pastel/50 bg-vert-pastel/10',
              },
            ].map(({ titre, duree, desc, couleur }) => (
              <div key={titre} className={`rounded-2xl border ${couleur} p-6`}>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl text-texte">{titre}</h2>
                  <span className="bg-blanc-casse text-texte/60 text-xs px-3 py-1 rounded-full">{duree}</span>
                </div>
                <p className="text-texte/65 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Composant de réservation Google Calendar */}
          <div className="bg-white rounded-3xl border border-rose-pastel/30 shadow-sm p-8">
            <GoogleCalendarBooking />
          </div>

          {/* Note bas de page */}
          <p className="text-center text-xs text-texte/40 mt-8">
            📍 Séances en cabinet au 29 place Bellecour, 69002 Lyon · et en visioconférence
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
