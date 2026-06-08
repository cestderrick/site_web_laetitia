import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-blanc-casse"
    >
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-vert-pastel/30 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-rose-pastel/30 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="container-max section-padding text-center relative z-10">
        {/* Accroche */}
        <p className="text-rose-saumon text-sm font-medium tracking-widest uppercase mb-6">
          Sophrologie &amp; Coaching à Lyon, Giez (Proche Annecy) et visio
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl text-texte leading-tight mb-6">
          Faire une pause
          <br />
          <span className="text-rose-saumon">pour mieux oser.</span>
        </h1>

        <p className="text-lg md:text-xl text-texte/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Un espace doux et bienveillant pour vous reconnecter à vous-même,
          traverser les transitions de vie et révéler vos ressources profondes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/rdv" className="btn-primary">
            Prendre rendez-vous
          </Link>
          <a href="#vision" className="btn-outline">
            Découvrir l'approche
          </a>
        </div>

        {/* Scroll indicator – flèche animée */}
        <a
          href="#qui-suis-je"
          aria-label="Défiler vers le bas"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-texte/30 hover:text-rose-saumon transition-colors"
        >
          <svg
            className="w-8 h-8 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </div>
    </section>
  )
}
