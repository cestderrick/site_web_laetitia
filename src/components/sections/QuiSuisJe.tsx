'use client'

import Image from 'next/image'
import { useContent, cs, applyStyle, imgSrc, getAlign } from '@/hooks/useContent'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
const S = 'quiSuisJe'
const D = {
  label:  'Qui suis-je ?',
  titre:  'Laetitia Chastel',
  texte1: "Je m'appelle Laetitia, passionnée par l'humain et les parcours de vie. Je me forme au Coaching à la JBS Coaching et à la Sophrologie Caycédienne, dans la continuité d'un chemin déjà tourné vers l'accompagnement.",
  texte2: "Mon goût pour l'écoute et le développement des potentiels s'est d'abord exprimé dans les Ressources Humaines et l'orientation professionnelle. J'y ai découvert combien l'accompagnement peut aider à traverser les transitions et à redonner du sens.",
  texte3: "Chacune de mes expériences m'a rapprochée un peu plus de ce qui m'anime profondément : comprendre l'humain, créer du lien, révéler les ressources.",
}

export default function QuiSuisJe() {
  const content = useContent()

  const label  = cs(content, S, 'label',  D.label)
  const titre  = cs(content, S, 'titre',  D.titre)
  const texte1 = cs(content, S, 'texte1', D.texte1)
  const texte2 = cs(content, S, 'texte2', D.texte2)
  const texte3 = cs(content, S, 'texte3', D.texte3)
  const photo  = cs(content, S, 'photo',  '/laetitia.webp')
  const photoSrc = photo.startsWith('/uploads') ? `${BACKEND}${photo}` : photo

  return (
    <section id="qui-suis-je" className="section-padding bg-rose-pastel/15">
      <div className="container-max">
        <div className="text-center mb-16">
          {/* Badge dynamique */}
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte"
              style={{ ...applyStyle(content, S, 'titre'), ...getAlign(content, S, 'titre') }}>
            {titre}
          </h2>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-rose-pastel/20">
              <Image src={photoSrc} alt="Laetitia Chastel – Sophrologue & Coach à Lyon"
                fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" priority />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-blanc-casse rounded-2xl shadow-lg p-4 flex gap-3 items-center">
              <span className="text-2xl">🎓</span>
              <div className="text-xs text-texte">
                <p className="font-semibold">Certifiée EMCC</p>
                <p className="text-texte/60">JBS Coaching • Sophrologie Caycédienne</p>
              </div>
            </div>
          </div>

          {/* Textes — chacun avec son alignement propre */}
          <div className="space-y-6 text-texte/80 text-lg leading-relaxed">
            <p style={getAlign(content, S, 'texte1')}>{texte1}</p>
            <p style={getAlign(content, S, 'texte2')}>{texte2}</p>
            <p style={getAlign(content, S, 'texte3')}>{texte3}</p>
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
