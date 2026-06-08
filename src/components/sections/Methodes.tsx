import Link from 'next/link'

const methodes = [
  {
    id:        'coaching',
    couleur:   'rose-saumon',
    bg:        'bg-rose-saumon/10',
    border:    'border-rose-saumon/30',
    tag:       'Méthode',
    titre:     'Coaching',
    accroche:  "De l’intention à l’action",
    texte: `Le coaching est un espace de réflexion et d'action qui permet de mieux comprendre
sa situation actuelle pour construire celle que l'on souhaite vivre.

Il accompagne les périodes de transition, les prises de décision et les envies
d'évolution, en aidant chacun à passer de l'intention à l'action.`,
    points: [
      'Transition professionnelle',
      'Prise de décision',
      'Confiance en soi',
      'Gestion des émotions',
    ],
    cta:   'Réserver une séance',
    lien:  '/rdv',
    icone: '🎯',
  },
  {
    id:        'sophrologie',
    couleur:   'vert-pastel',
    bg:        'bg-vert-pastel/20',
    border:    'border-vert-pastel/40',
    tag:       'Méthode',
    titre:     'Sophrologie',
    accroche:  'Entraîner sa conscience',
    texte: `La Sophrologie Caycédienne, créée par le psychiatre et professeur Alfonso Caycedo,
est une méthode d'accompagnement qui combine la respiration, le mouvement et les
évocations positives afin d'amener du mieux-être.

Il s'agit d'un entraînement de la conscience qui permet de développer la conscience
de soi et d'activer ses propres ressources au quotidien.`,
    points: [
      'Gestion du stress & anxiété',
      'Préparation mentale',
      'Accompagnement de la douleur',
      'Séances individuelles ou en groupe',
    ],
    cta:   'Je veux essayer',
    lien:  '/rdv',
    icone: '🌿',
  },
]

export default function Methodes() {
  return (
    <section id="methodes" className="section-padding bg-blanc-casse">
      <div className="container-max">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            Mes méthodes
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-6">
            Deux approches complémentaires
          </h2>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {methodes.map((m) => (
            <article
              key={m.id}
              id={m.id}
              className={`rounded-3xl border ${m.border} ${m.bg} p-8 md:p-10 flex flex-col gap-6`}
            >
              {/* Header centré */}
              <div className="text-center">
                <span className="text-4xl mb-4 block">{m.icone}</span>
                <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-1">
                  {m.tag}
                </p>
                <h3 className="text-3xl text-texte mb-1">{m.titre}</h3>
                <p className="text-texte/50 italic">{m.accroche}</p>
              </div>

              {/* Texte */}
              <div className="text-texte/75 leading-relaxed whitespace-pre-line text-[15px]">
                {m.texte}
              </div>

              {/* Points clés */}
              <ul className="flex flex-col gap-2">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-texte/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-saumon flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* CTA centré */}
              <div className="flex justify-center mt-auto">
                <Link href={m.lien} className="btn-primary">
                  {m.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
