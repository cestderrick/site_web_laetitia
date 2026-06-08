import Image from 'next/image'

export default function QuiSuisJe() {
  return (
    <section id="qui-suis-je" className="section-padding bg-rose-pastel/15">
      <div className="container-max">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            Qui suis-je ?
          </p>
          <h2 className="text-4xl md:text-5xl text-texte">
            Laetitia Chastel
          </h2>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-rose-pastel/20">
              <Image
                src="/laetitia.webp"
                alt="Laetitia Chastel – Sophrologue & Coach à Lyon"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Badge certifications */}
            <div className="absolute -bottom-6 -right-4 bg-blanc-casse rounded-2xl shadow-lg p-4 flex gap-3 items-center">
              <span className="text-2xl">🎓</span>
              <div className="text-xs text-texte">
                <p className="font-semibold">Certifiée EMCC</p>
                <p className="text-texte/60">JBS Coaching • Sophrologie Caycédienne</p>
              </div>
            </div>
          </div>

          {/* Texte */}
          <div className="space-y-6 text-texte/80 text-lg leading-relaxed">
            <p>
              Je m'appelle <strong className="text-texte">Laetitia</strong>, passionnée
              par l'humain et les parcours de vie. Je me forme au{' '}
              <strong className="text-texte">Coaching à la JBS Coaching</strong> et à la{' '}
              <strong className="text-texte">Sophrologie Caycédienne</strong>, dans la
              continuité d'un chemin déjà tourné vers l'accompagnement.
            </p>
            <p>
              Mon goût pour l'écoute et le développement des potentiels s'est d'abord
              exprimé dans les <strong className="text-texte">Ressources Humaines</strong> et{' '}
              <strong className="text-texte">l'orientation professionnelle</strong>.
              J'y ai découvert combien l'accompagnement peut aider à traverser les
              transitions et à redonner du sens.
            </p>
            <p>
              Chacune de mes expériences m'a rapprochée un peu plus de ce qui m'anime
              profondément : <em>comprendre l'humain, créer du lien, révéler les ressources</em>.
            </p>

            {/* Localisation */}
            <div className="flex items-start gap-3 pt-4 border-t border-rose-pastel/30">
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <p className="font-semibold text-texte">29 place Bellecour</p>
                <p className="text-texte/60 text-base">69002 Lyon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
