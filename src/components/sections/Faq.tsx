'use client'

import { useState } from 'react'
import { useContent, cs, applyStyle, getAlign, renderRich } from '@/hooks/useContent'

const S = 'faq'
const D = {
  label:     'Questions fréquentes',
  titre:     'Sophrologie & Coaching à Lyon',
  sousTitre: 'Tout ce que vous voulez savoir avant votre première séance.',
  q1: "Qu'est-ce que la sophrologie caycédienne ?",
  a1: "La sophrologie caycédienne est une méthode créée par le psychiatre Alfonso Caycedo. Elle combine respiration consciente, mouvements doux et évocations positives pour développer la conscience de soi et activer vos ressources intérieures. Les séances se pratiquent debout, assis ou allongé — aucun prérequis n'est nécessaire.",
  q2: 'En quoi le coaching diffère-t-il de la sophrologie ?',
  a2: "La sophrologie travaille sur le corps, les sensations et le mieux-être. Le coaching est un espace de réflexion orienté vers l'action : clarifier un objectif, prendre une décision, traverser une transition. Les deux approches sont complémentaires et peuvent être combinées selon votre situation.",
  q3: 'Combien de séances faut-il prévoir ?',
  a3: "Cela dépend de votre objectif. En sophrologie, un cycle de 6 à 8 séances permet d'apprendre les techniques et de les intégrer au quotidien. En coaching, la durée varie selon le projet. Une première séance découverte permet de faire le point ensemble sans engagement.",
  q4: 'Les séances sont-elles remboursées par la mutuelle ?',
  a4: "La sophrologie n'est pas remboursée par la Sécurité Sociale, mais de nombreuses mutuelles participent aux frais. Renseignez-vous auprès de votre complémentaire santé. Une facture peut vous être remise sur demande.",
  q5: 'Peut-on faire des séances en visio ?',
  a5: "Oui, toutes les séances (sophrologie et coaching) sont proposées en visioconférence pour toute la France. La qualité de l'accompagnement est identique : vous avez juste besoin d'un endroit calme et d'une connexion internet.",
  q6: 'Proposez-vous des interventions en entreprise à Lyon ?',
  a6: "Oui, P.ose intervient en entreprise à Lyon et en région Auvergne-Rhône-Alpes : ateliers de sophrologie, coaching d'équipe, programmes bien-être sur plusieurs semaines, conférences. Chaque intervention est construite sur mesure après un échange préalable.",
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const content = useContent()

  const label     = cs(content, S, 'label',     D.label)
  const titre     = cs(content, S, 'titre',     D.titre)
  const sousTitre = cs(content, S, 'sousTitre', D.sousTitre)

  const faqs = [1, 2, 3, 4, 5, 6].map(n => ({
    q: cs(content, S, `q${n}`, D[`q${n}` as keyof typeof D]),
    a: cs(content, S, `a${n}`, D[`a${n}` as keyof typeof D]),
  })).filter(({ q }) => q) // masquer les questions vides

  return (
    <section className="section-padding bg-rose-pastel/10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-4"
              style={{ ...applyStyle(content, S, 'titre'), ...getAlign(content, S, 'titre') }}
              dangerouslySetInnerHTML={renderRich(titre)} />
          <p className="text-texte/60 text-lg max-w-xl mx-auto"
             dangerouslySetInnerHTML={renderRich(sousTitre)} />
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i}
              className="bg-blanc-casse rounded-2xl border border-rose-pastel/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 text-texte font-medium hover:text-rose-saumon transition-colors"
              >
                <span dangerouslySetInnerHTML={renderRich(q)} />
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-rose-saumon transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-texte/70 leading-relaxed border-t border-rose-pastel/20 pt-4"
                     dangerouslySetInnerHTML={renderRich(a)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
