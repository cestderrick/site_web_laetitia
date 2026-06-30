'use client'

import Link from 'next/link'
import { useContent, cs, applyStyle, getAlign, renderRich } from '@/hooks/useContent'

const DC = {
  titre:    'Coaching',
  accroche: "De l'intention à l'action",
  texte:    "Le coaching est un espace de réflexion et d'action qui permet de mieux comprendre sa situation actuelle pour construire celle que l'on souhaite vivre.\n\nIl accompagne les périodes de transition, les prises de décision et les envies d'évolution, en aidant chacun à passer de l'intention à l'action.",
}
const DS = {
  titre:    'Sophrologie',
  accroche: 'Entraîner sa conscience',
  texte:    "La Sophrologie Caycédienne, créée par le psychiatre et professeur Alfonso Caycedo, est une méthode d'accompagnement qui combine la respiration, le mouvement et les évocations positives afin d'amener du mieux-être.\n\nIl s'agit d'un entraînement de la conscience qui permet de développer la conscience de soi et d'activer ses propres ressources au quotidien.",
}

const COACHING_POINTS    = ['Évolution professionnelle', 'Atteinte d\'un objectif', 'Confiance en soi', 'Accompagnement changements de vie']
const SOPHROLOGIE_POINTS = ['Gestion du stress & anxiété', 'Préparation mentale', 'Accompagnement de la douleur', 'Travail de la concentration','Connexion au corps']

export default function Methodes() {
  const content = useContent()

  const methodes = [
    {
      id:      'coaching',
      bg:      'bg-rose-saumon/10',
      border:  'border-rose-saumon/30',
      icone:   '🎯',
      titre:   cs(content, 'coaching',    'titre',    DC.titre),
      accroche:cs(content, 'coaching',    'accroche', DC.accroche),
      texte:   cs(content, 'coaching',    'texte',    DC.texte),
      points:  COACHING_POINTS,
      cta:     'Réserver une séance',
      lien:    '/rdv',
      section: 'coaching',
    },
    {
      id:      'sophrologie',
      bg:      'bg-vert-pastel/20',
      border:  'border-vert-pastel/40',
      icone:   '🌿',
      titre:   cs(content, 'sophrologie', 'titre',    DS.titre),
      accroche:cs(content, 'sophrologie', 'accroche', DS.accroche),
      texte:   cs(content, 'sophrologie', 'texte',    DS.texte),
      points:  SOPHROLOGIE_POINTS,
      cta:     'Je veux essayer',
      lien:    '/rdv',
      section: 'sophrologie',
    },
  ]

  return (
    <section id="methodes" className="section-padding bg-blanc-casse">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {cs(content, 'methodes', 'label', 'Mes méthodes')}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-6" style={applyStyle(content, 'methodes', 'titre')}
              dangerouslySetInnerHTML={renderRich(cs(content, 'methodes', 'titre', 'Deux approches complémentaires'))} />
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {methodes.map((m) => (
            <article
              key={m.id}
              id={m.id}
              className={`rounded-3xl border ${m.border} ${m.bg} p-8 md:p-10 flex flex-col gap-6`}
            >
              <div className="text-center">
                <span className="text-4xl mb-4 block">{m.icone}</span>
                <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-1">
                  {cs(content, m.section, 'label', 'Méthode')}
                </p>
                <h3 className="text-3xl text-texte mb-1"
                    style={{ ...applyStyle(content, m.section, 'titre'), ...getAlign(content, m.section, 'titre') }}
                    dangerouslySetInnerHTML={renderRich(m.titre)} />
                <p className="text-texte/50 italic"
                   style={{ ...applyStyle(content, m.section, 'accroche'), ...getAlign(content, m.section, 'accroche') }}
                   dangerouslySetInnerHTML={renderRich(m.accroche)} />
              </div>

              <div className="text-texte/75 leading-relaxed text-[15px]"
                   style={getAlign(content, m.section, 'texte')}
                   dangerouslySetInnerHTML={renderRich(m.texte)}>
              </div>

              <ul className="flex flex-col gap-2">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-texte/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-saumon flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="flex justify-center mt-auto">
                <Link href={m.lien} className="btn-primary">{m.cta}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
