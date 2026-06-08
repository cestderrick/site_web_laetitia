import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EntreprisesContact from '@/components/sections/EntreprisesContact'

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

const offres = [
  {
    emoji: '🧘',
    titre: 'Ateliers sophrologie',
    desc:  'Séances collectives de sophrologie pour apprendre à gérer le stress, retrouver de l\'énergie et améliorer la concentration. Format ponctuel ou programme sur plusieurs semaines.',
    details: ['1h à 1h30 par session', 'Jusqu\'à 12 participants', 'Présentiel ou visio'],
  },
  {
    emoji: '🎯',
    titre: 'Coaching d\'équipe',
    desc:  'Accompagnement collectif pour renforcer la cohésion, clarifier les objectifs communs et améliorer la communication au sein de l\'équipe.',
    details: ['Demi-journée ou journée', 'Sur mesure selon vos enjeux', 'Présentiel ou visio'],
  },
  {
    emoji: '🌿',
    titre: 'Programme bien-être',
    desc:  'Programme clé en main combinant sophrologie, coaching individuel et ateliers thématiques pour ancrer durablement le bien-être dans votre entreprise.',
    details: ['Sur 4 à 12 semaines', 'Bilan initial & suivi', 'Rapport final inclus'],
  },
  {
    emoji: '💡',
    titre: 'Conférences & sensibilisation',
    desc:  'Interventions ponctuelles sur des thématiques comme la gestion du stress, la prévention du burn-out ou la qualité de vie au travail.',
    details: ['45 min à 1h30', 'Idéal pour séminaires', 'Support de présentation fourni'],
  },
]

const benefices = [
  { icon: '📈', text: 'Réduction de l\'absentéisme' },
  { icon: '⚡', text: 'Regain d\'énergie et de motivation' },
  { icon: '🤝', text: 'Meilleure cohésion d\'équipe' },
  { icon: '🧠', text: 'Amélioration de la concentration' },
  { icon: '😌', text: 'Gestion du stress et des émotions' },
  { icon: '🏆', text: 'Performance durable' },
]

export default function EntreprisesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="min-h-[50vh] bg-blanc-casse flex items-center pt-28 pb-16 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[35vw] h-[35vw] max-w-[500px] bg-vert-pastel/25 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="container-max relative z-10">
            <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-4">
              Sophrologie & Coaching en entreprise
            </p>
            <h1 className="text-4xl md:text-6xl text-texte mb-6 max-w-3xl leading-tight">
              Le bien-être de vos équipes,<br />
              <span className="text-rose-saumon">un investissement durable.</span>
            </h1>
            <p className="text-texte/65 text-lg max-w-2xl leading-relaxed mb-8">
              Des interventions sur mesure pour réduire le stress, renforcer la cohésion
              et améliorer la qualité de vie au travail — à Lyon, Giez et en visio.
            </p>
            <a href="#devis" className="btn-primary">Demander un devis</a>
          </div>
        </section>

        {/* Bénéfices */}
        <section className="section-padding bg-vert-pastel/15">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-texte mb-3">Pourquoi investir dans le bien-être ?</h2>
              <div className="w-12 h-0.5 bg-rose-saumon mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefices.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-blanc-casse rounded-xl px-5 py-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-texte/80 font-medium text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offres */}
        <section className="section-padding bg-blanc-casse">
          <div className="container-max">
            <div className="text-center mb-14">
              <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">Nos offres</p>
              <h2 className="text-3xl md:text-4xl text-texte mb-3">Des formats adaptés à vos besoins</h2>
              <p className="text-texte/55 max-w-xl mx-auto">
                Chaque intervention est construite sur mesure après un échange préalable
                pour cerner vos enjeux et votre culture d'entreprise.
              </p>
              <div className="w-12 h-0.5 bg-rose-saumon mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {offres.map(({ emoji, titre, desc, details }) => (
                <article key={titre} className="bg-white border border-rose-pastel/25 rounded-2xl p-7 hover:shadow-md transition-shadow">
                  <span className="text-4xl mb-4 block">{emoji}</span>
                  <h3 className="text-2xl text-texte mb-2">{titre}</h3>
                  <p className="text-texte/65 text-sm leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1">
                    {details.map(d => (
                      <li key={d} className="flex items-center gap-2 text-sm text-texte/55">
                        <span className="w-1 h-1 rounded-full bg-rose-saumon flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire devis */}
        <section id="devis" className="section-padding bg-rose-pastel/10">
          <div className="container-max">
            <div className="text-center mb-12">
              <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">Devis gratuit</p>
              <h2 className="text-3xl md:text-4xl text-texte mb-3">Parlons de votre projet</h2>
              <p className="text-texte/60 max-w-lg mx-auto leading-relaxed">
                Remplissez le formulaire ci-dessous et Laetitia vous recontacte
                sous 48h pour affiner votre besoin et vous proposer un devis personnalisé.
              </p>
              <div className="w-12 h-0.5 bg-rose-saumon mx-auto mt-6" />
            </div>
            <EntreprisesContact />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
