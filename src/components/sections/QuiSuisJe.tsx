'use client'

import Image from 'next/image'
import { useContent, cs, applyStyle, imgSrc, getAlign, renderRich } from '@/hooks/useContent'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
const S = 'quiSuisJe'
const D = {
  label:         'Qui suis-je ?',
  titre:         'Laetitia Chastel',
  texte1:        "Je m'appelle Laetitia, passionnée par l'humain et les parcours de vie. Je me forme au Coaching à la JBS Coaching et à la Sophrologie Caycédienne, dans la continuité d'un chemin déjà tourné vers l'accompagnement.",
  texte2:        "Mon goût pour l'écoute et le développement des potentiels s'est d'abord exprimé dans les Ressources Humaines et l'orientation professionnelle. J'y ai découvert combien l'accompagnement peut aider à traverser les transitions et à redonner du sens.",
  texte3:        "Chacune de mes expériences m'a rapprochée un peu plus de ce qui m'anime profondément : comprendre l'humain, créer du lien, révéler les ressources.",
  adresse_label: '29 place Bellecour — 69002 Lyon',
  visio_visible: 'oui',
  visio_label:   'En visio (France entière)',
  emcc_visible:  'oui',
  emcc_titre:    'Certifiée EMCC',
  emcc_sous:     'JBS Coaching • Sophrologie Caycédienne',
}

export default function QuiSuisJe() {
  const content = useContent()

  const label        = cs(content, S, 'label',         D.label)
  const titre        = cs(content, S, 'titre',         D.titre)
  const texte1       = cs(content, S, 'texte1',        D.texte1)
  const texte2       = cs(content, S, 'texte2',        D.texte2)
  const texte3       = cs(content, S, 'texte3',        D.texte3)
  const photo        = cs(content, S, 'photo',         '/laetitia.webp')
  const adresseLabel = cs(content, S, 'adresse_label', D.adresse_label)
  const visioVisible = cs(content, S, 'visio_visible', D.visio_visible) !== 'non'
  const visioLabel   = cs(content, S, 'visio_label',   D.visio_label)
  const emccVisible  = cs(content, S, 'emcc_visible',  D.emcc_visible) !== 'non'
  const emccTitre    = cs(content, S, 'emcc_titre',    D.emcc_titre)
  const emccSous     = cs(content, S, 'emcc_sous',     D.emcc_sous)

  const photoSrc = photo.startsWith('/uploads') ? `${BACKEND}${photo}` : photo

  return (
    <section id="qui-suis-je" className="section-padding bg-rose-pastel/15">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl text-texte"
              style={{ ...applyStyle(content, S, 'titre'), ...getAlign(content, S, 'titre') }}
              dangerouslySetInnerHTML={renderRich(titre)} />
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-rose-pastel/20">
              <Image src={photoSrc} alt="Laetitia Chastel – Sophrologue & Coach à Lyon"
                fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 50vw" priority />
            </div>
            {/* Badge EMCC conditionnel */}
            {emccVisible && (
              <div className="absolute -bottom-6 -right-4 bg-blanc-casse rounded-2xl shadow-lg p-4 flex gap-3 items-center">
                <span className="text-2xl">🎓</span>
                <div className="text-xs text-texte">
                  <p className="font-semibold" style={applyStyle(content, S, 'emcc_titre')}>{emccTitre}</p>
                  <p className="text-texte/60">{emccSous}</p>
                </div>
              </div>
            )}
          </div>

          {/* Textes */}
          <div className="space-y-6 text-texte/80 text-lg leading-relaxed">
            <p dangerouslySetInnerHTML={renderRich(texte1)} style={getAlign(content, S, 'texte1')} />
            <p dangerouslySetInnerHTML={renderRich(texte2)} style={getAlign(content, S, 'texte2')} />
            <p dangerouslySetInnerHTML={renderRich(texte3)} style={getAlign(content, S, 'texte3')} />

            {/* Adresse + visio */}
            <div className="flex flex-col gap-2 pt-4 border-t border-rose-pastel/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <p className="text-texte font-medium text-base">{adresseLabel}</p>
              </div>
              {visioVisible && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">💻</span>
                  <p className="text-texte/70 text-base">{visioLabel}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
