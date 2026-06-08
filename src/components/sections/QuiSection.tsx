import Link from 'next/link'

const profils = [
  {
    emoji: '🌀',
    titre: 'Vous traversez une transition',
    desc:  "Changement de poste, reconversion, séparation, déménagement… Vous cherchez à retrouver un cap et à avancer avec clarté.",
  },
  {
    emoji: '⚡',
    titre: 'Vous êtes débordé·e ou épuisé·e',
    desc:  "Stress chronique, surcharge mentale, difficulté à déconnecter. Vous avez besoin d'outils concrets pour retrouver calme et équilibre.",
  },
  {
    emoji: '🌱',
    titre: 'Vous souhaitez vous développer',
    desc:  "Confiance en soi, affirmation, gestion des émotions. Vous voulez mieux vous connaître et libérer vos ressources intérieures.",
  },
  {
    emoji: '🎯',
    titre: 'Vous avez un objectif à atteindre',
    desc:  "Examen, compétition, prise de parole, projet de vie. Vous souhaitez préparer mentalement une étape importante.",
  },
]

export default function QuiSection() {
  return (
    <section id="qui" className="section-padding bg-blanc-casse">
      <div className="container-max">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            Pour qui ?
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-4">
            Cet accompagnement est fait pour vous si…
          </h2>
          <p className="text-texte/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Que vous soyez en plein questionnement, en période de changement ou simplement
            en quête de mieux-être — il n'y a pas de bonne ou mauvaise raison de se faire accompagner.
          </p>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        {/* Grille de profils */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {profils.map(({ emoji, titre, desc }) => (
            <div
              key={titre}
              className="bg-blanc-casse border border-rose-pastel/30 rounded-2xl p-6 hover:border-rose-saumon/50 hover:shadow-md transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{emoji}</span>
              <h3 className="font-heading text-xl text-texte mb-3 leading-tight">{titre}</h3>
              <p className="text-texte/65 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA central */}
        <div className="text-center bg-rose-pastel/15 rounded-3xl p-10">
          <p className="text-texte/70 text-lg mb-2">Vous vous reconnaissez dans l'un de ces profils ?</p>
          <h3 className="text-3xl text-texte mb-6">
            Faisons connaissance lors d'un premier échange.
          </h3>
          <Link href="/rdv" className="btn-primary">
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </section>
  )
}
