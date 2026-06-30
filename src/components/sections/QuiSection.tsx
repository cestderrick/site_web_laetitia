'use client'

import Link from 'next/link'
import { useContent, cs, applyStyle, getAlign, renderRich } from '@/hooks/useContent'

const S = 'quiSection'
const D = {
  label:      'Pour qui ?',
  titre:      "Cet accompagnement est fait pour vous si…",
  intro:      "Que vous soyez en plein questionnement, en période de changement ou simplement en quête de mieux-être — il n'y a pas de bonne ou mauvaise raison de se faire accompagner.",
  cta_texte:  "Vous vous reconnaissez dans l'un de ces profils ?",
  cta_titre:  "Faisons connaissance lors d'un premier échange.",
  cta_bouton: 'Prendre rendez-vous',
}

const profils = [
  {
    emoji: '🌀',
    titre: 'Vous traversez une transition',
    desc:  "Changement de poste, reconversion, séparation, déménagement… Vous cherchez à retrouver un cap et à avancer avec clarté.",
  },
  {
    emoji: '⚡',
    titre: 'Vous êtes débordé·e ou épuisé·e',
    desc:  "Stress chronique, surcharge mentale, difficulté à déconnecter. Vous avez besoin d'un espace et d'outils concrets pour retrouver du calme.",
  },
  {
    emoji: '🌱',
    titre: 'Vous souhaitez vous développer',
    desc:  "Confiance en soi, affirmation de soi, gestion des émotions. Vous voulez mieux vous connaître et prendre conscience de vos ressources.",
  },
  {
    emoji: '🎯',
    titre: "Vous avez envie d'atteindre un objectif",
    desc:  "Examen, compétition, prise de parole, projet de vie. Vous souhaitez préparer mentalement une étape importante.",
  },
]

export default function QuiSection() {
  const content = useContent()

  const label     = cs(content, S, 'label',      D.label)
  const titre     = cs(content, S, 'titre',      D.titre)
  const intro     = cs(content, S, 'intro',      D.intro)
  const ctaTexte  = cs(content, S, 'cta_texte',  D.cta_texte)
  const ctaTitre  = cs(content, S, 'cta_titre',  D.cta_titre)
  const ctaBouton = cs(content, S, 'cta_bouton', D.cta_bouton)

  return (
    <section id="qui" className="section-padding bg-blanc-casse">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-4"
              style={{ ...applyStyle(content, S, 'titre'), ...getAlign(content, S, 'titre') }}
              dangerouslySetInnerHTML={renderRich(titre)} />
          <p className="text-texte/60 text-lg max-w-2xl mx-auto leading-relaxed"
             style={getAlign(content, S, 'intro')}
             dangerouslySetInnerHTML={renderRich(intro)} />
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {profils.map(({ emoji, titre: ptittre, desc }) => (
            <div key={ptittre}
              className="bg-blanc-casse border border-rose-pastel/30 rounded-2xl p-6 hover:border-rose-saumon/50 hover:shadow-md transition-all duration-300">
              <span className="text-3xl mb-4 block">{emoji}</span>
              <h3 className="font-heading text-xl text-texte mb-3 leading-tight">{ptittre}</h3>
              <p className="text-texte/65 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-rose-pastel/15 rounded-3xl p-10">
          <p className="text-texte/70 text-lg mb-2" dangerouslySetInnerHTML={renderRich(ctaTexte)} />
          <h3 className="text-3xl text-texte mb-6"
              style={applyStyle(content, S, 'cta_titre')}
              dangerouslySetInnerHTML={renderRich(ctaTitre)} />
          <Link href="/rdv" className="btn-primary">{ctaBouton}</Link>
        </div>
      </div>
    </section>
  )
}
