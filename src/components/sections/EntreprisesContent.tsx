'use client'

import { useContent, cs, applyStyle, getAlign, renderRich } from '@/hooks/useContent'
import EntreprisesContact from './EntreprisesContact'

const BENEFICES_ICONS = ['📈', '⚡', '🤝', '🧠', '😌', '🏆']
const OFFRES_EMOJIS   = ['🧘', '🎯', '🌿', '💡']

const DH = {
  accroche:  'Sophrologie & Coaching en entreprise',
  titre1:    'Le bien-être de vos équipes,',
  titre2:    'un investissement durable.',
  sousTitre: "Des interventions sur mesure pour réduire le stress, renforcer la cohésion et améliorer la qualité de vie au travail — à Lyon, Giez et en visio.",
}
const DB = {
  titre: 'Pourquoi investir dans le bien-être ?',
  b1: "Réduction de l'absentéisme", b2: "Regain d'énergie et de motivation",
  b3: "Meilleure cohésion d'équipe", b4: "Amélioration de la concentration",
  b5: "Gestion du stress et des émotions", b6: "Performance durable",
}
const DO = {
  titre: 'Des formats adaptés à vos besoins',
  sousTitre: "Chaque intervention est construite sur mesure après un échange préalable pour cerner vos enjeux et votre culture d'entreprise.",
  offre1_titre: 'Ateliers sophrologie',
  offre1_desc:  "Séances collectives de sophrologie pour apprendre à gérer le stress, retrouver de l'énergie et améliorer la concentration.",
  offre1_d1: '1h à 1h30 par session', offre1_d2: "Jusqu'à 12 participants", offre1_d3: 'Présentiel ou visio',
  offre2_titre: "Coaching d'équipe",
  offre2_desc:  "Accompagnement collectif pour renforcer la cohésion, clarifier les objectifs communs et améliorer la communication au sein de l'équipe.",
  offre2_d1: 'Demi-journée ou journée', offre2_d2: 'Sur mesure selon vos enjeux', offre2_d3: 'Présentiel ou visio',
  offre3_titre: 'Programme bien-être',
  offre3_desc:  "Programme clé en main combinant sophrologie, coaching individuel et ateliers thématiques pour ancrer durablement le bien-être.",
  offre3_d1: 'Sur 4 à 12 semaines', offre3_d2: 'Bilan initial & suivi', offre3_d3: 'Rapport final inclus',
  offre4_titre: 'Conférences & sensibilisation',
  offre4_desc:  "Interventions ponctuelles sur des thématiques comme la gestion du stress, la prévention du burn-out ou la qualité de vie au travail.",
  offre4_d1: '45 min à 1h30', offre4_d2: 'Idéal pour séminaires', offre4_d3: 'Support de présentation fourni',
}

export default function EntreprisesContent() {
  const content = useContent()

  const EH = 'entreprisesHero'
  const EB = 'entreprisesBenefices'
  const EO = 'entreprisesOffres'

  const accroche  = cs(content, EH, 'accroche',  DH.accroche)
  const titre1    = cs(content, EH, 'titre1',    DH.titre1)
  const titre2    = cs(content, EH, 'titre2',    DH.titre2)
  const sousTitre = cs(content, EH, 'sousTitre', DH.sousTitre)

  const beneficesList = [1, 2, 3, 4, 5, 6].map(n => ({
    icon: BENEFICES_ICONS[n - 1],
    text: cs(content, EB, `b${n}`, DB[`b${n}` as keyof typeof DB]),
  }))

  const offresList = [1, 2, 3, 4].map(n => ({
    emoji:   OFFRES_EMOJIS[n - 1],
    titre:   cs(content, EO, `offre${n}_titre`, DO[`offre${n}_titre` as keyof typeof DO]),
    desc:    cs(content, EO, `offre${n}_desc`,  DO[`offre${n}_desc`  as keyof typeof DO]),
    details: [
      cs(content, EO, `offre${n}_d1`, DO[`offre${n}_d1` as keyof typeof DO]),
      cs(content, EO, `offre${n}_d2`, DO[`offre${n}_d2` as keyof typeof DO]),
      cs(content, EO, `offre${n}_d3`, DO[`offre${n}_d3` as keyof typeof DO]),
    ].filter(Boolean),
  }))

  return (
    <>
      {/* Hero */}
      <section className="min-h-[50vh] bg-blanc-casse flex items-center pt-28 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[35vw] h-[35vw] max-w-[500px] bg-vert-pastel/25 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="container-max relative z-10">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-4"
             style={{ ...applyStyle(content, EH, 'accroche'), ...getAlign(content, EH, 'accroche') }}>
            {accroche}
          </p>
          <h1 className="text-4xl md:text-6xl text-texte mb-6 max-w-3xl leading-tight">
            <span style={{ ...applyStyle(content, EH, 'titre1'), ...getAlign(content, EH, 'titre1') }}
                  className="block" dangerouslySetInnerHTML={renderRich(titre1)} />
            <span style={{ ...applyStyle(content, EH, 'titre2'), ...getAlign(content, EH, 'titre2') }}
                  className="block text-rose-saumon" dangerouslySetInnerHTML={renderRich(titre2)} />
          </h1>
          <p className="text-texte/65 text-lg max-w-2xl leading-relaxed mb-8"
             style={{ ...applyStyle(content, EH, 'sousTitre'), ...getAlign(content, EH, 'sousTitre') }}
             dangerouslySetInnerHTML={renderRich(sousTitre)} />
          <div style={getAlign(content, EH, 'sousTitre')}>
            <a href="#devis" className="btn-primary inline-block">Demander un devis</a>
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="section-padding bg-vert-pastel/15">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-texte mb-3"
                style={applyStyle(content, EB, 'titre')}
                dangerouslySetInnerHTML={renderRich(cs(content, EB, 'titre', DB.titre))} />
            <div className="w-12 h-0.5 bg-rose-saumon mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beneficesList.map(({ icon, text }) => (
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
            <h2 className="text-3xl md:text-4xl text-texte mb-3" style={applyStyle(content, EO, 'titre')}
                dangerouslySetInnerHTML={renderRich(cs(content, EO, 'titre', DO.titre))} />
            <p className="text-texte/55 max-w-xl mx-auto"
               dangerouslySetInnerHTML={renderRich(cs(content, EO, 'sousTitre', DO.sousTitre))} />
            <div className="w-12 h-0.5 bg-rose-saumon mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {offresList.map(({ emoji, titre, desc, details }) => (
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
            <h2 className="text-3xl md:text-4xl text-texte mb-3"
                style={applyStyle(content, 'devis', 'titre')}
                dangerouslySetInnerHTML={renderRich(cs(content, 'devis', 'titre', 'Parlons de votre projet'))} />
            <p className="text-texte/60 max-w-lg mx-auto leading-relaxed"
               dangerouslySetInnerHTML={renderRich(cs(content, 'devis', 'sousTitre', "Remplissez le formulaire ci-dessous et Laetitia vous recontacte sous 48h pour affiner votre besoin et vous proposer un devis personnalisé."))} />
            <div className="w-12 h-0.5 bg-rose-saumon mx-auto mt-6" />
          </div>
          <EntreprisesContact />
        </div>
      </section>
    </>
  )
}
