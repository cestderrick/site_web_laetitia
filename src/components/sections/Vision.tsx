export default function Vision() {
  return (
    <section id="vision" className="section-padding bg-vert-pastel/20">
      <div className="container-max">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            Ma vision
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-6">
            Un accompagnement ancré dans le vivant
          </h2>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto" />
        </div>

        {/* Contenu */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="space-y-6 text-texte/80 text-lg leading-relaxed">
            <p>
              Je crois profondément que chacun porte en lui les ressources nécessaires
              pour traverser les moments difficiles et se construire une vie qui lui ressemble.
            </p>
            <p>
              Mon rôle n'est pas de vous donner des réponses, mais de créer un espace
              de confiance où vous pouvez les trouver vous-même — à votre rythme,
              avec douceur et exigence.
            </p>
            <p>
              <strong className="text-texte">Ma conviction :</strong>{' '}
              Les périodes d'incertitude sont des opportunités de se reconnecter
              à ce qui compte vraiment.
            </p>
          </div>

          {/* Valeurs */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { emoji: '🌿', titre: 'Bienveillance', desc: 'Un espace sans jugement, à votre rythme.' },
              { emoji: '🎯', titre: 'Engagement',    desc: "De l'intention à l'action, ensemble." },
              { emoji: '🔎', titre: 'Conscience',    desc: 'Développer la connaissance de soi.' },
              { emoji: '✨', titre: 'Autonomie',     desc: 'Vous rendre libre de vos ressources.' },
            ].map(({ emoji, titre, desc }) => (
              <div
                key={titre}
                className="bg-blanc-casse rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-3 block">{emoji}</span>
                <h3 className="font-heading text-xl text-texte mb-1">{titre}</h3>
                <p className="text-texte/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
