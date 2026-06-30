'use client'

import { useContent, cs, applyStyle, getAlign, renderRich } from '@/hooks/useContent'

const S = 'vision'
const D = {
  label:      'Ma vision',
  titre:      'Un accompagnement ancré dans le vivant',
  texte1:     "Je crois profondément que chacun porte en lui les ressources nécessaires pour traverser les moments difficiles et se construire une vie qui lui ressemble.",
  texte2:     "Mon rôle n'est pas de vous donner des réponses, mais de créer un espace de confiance où vous pouvez les trouver vous-même — à votre rythme, avec douceur et exigence.",
  conviction: "Les périodes d'incertitude sont des opportunités de se reconnecter à ce qui compte vraiment.",
}

export default function Vision() {
  const content = useContent()

  const label      = cs(content, S, 'label',      D.label)
  const titre      = cs(content, S, 'titre',      D.titre)
  const texte1     = cs(content, S, 'texte1',     D.texte1)
  const texte2     = cs(content, S, 'texte2',     D.texte2)
  const conviction = cs(content, S, 'conviction', D.conviction)

  return (
    <section id="vision" className="section-padding bg-vert-pastel/20">
      <div className="container-max">
        <div className="text-center mb-16">
          {/* Badge dynamique */}
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-6"
              style={{ ...applyStyle(content, S, 'titre'), ...getAlign(content, S, 'titre') }}
              dangerouslySetInnerHTML={renderRich(titre)} />
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Textes — chacun avec son alignement propre */}
          <div className="space-y-6 text-texte/80 text-lg leading-relaxed">
            {texte1.trim() && <p dangerouslySetInnerHTML={renderRich(texte1)} style={getAlign(content, S, 'texte1')} />}
            {texte2.trim() && <p dangerouslySetInnerHTML={renderRich(texte2)} style={getAlign(content, S, 'texte2')} />}
            {conviction.trim() && (
              <p style={getAlign(content, S, 'conviction')}>
                <strong className="text-texte">Ma conviction :</strong>{' '}
                <span dangerouslySetInnerHTML={renderRich(conviction)} />
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { emoji: '🌿', titre: 'Bienveillance', desc: 'Un espace sans jugement, à votre rythme.' },
              { emoji: '🎯', titre: 'Engagement',    desc: "De l'intention à l'action, ensemble." },
              { emoji: '🔎', titre: 'Conscience',    desc: 'Développer la connaissance de soi.' },
              { emoji: '✨', titre: 'Autonomie',     desc: 'Vous rendre libre de vos ressources.' },
            ].map(({ emoji, titre: t, desc }) => (
              <div key={t} className="bg-blanc-casse rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{emoji}</span>
                <h3 className="font-heading text-xl text-texte mb-1">{t}</h3>
                <p className="text-texte/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
