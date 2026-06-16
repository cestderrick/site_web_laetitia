'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

type Content = Record<string, Record<string, string>>

// ── Palette couleurs (10) ─────────────────────────────────────────────────────
const COLORS = [
  { label: 'Rose saumon',  value: '#f0806b' },
  { label: 'Rose foncé',   value: '#d4614e' },
  { label: 'Rose pastel',  value: '#f5c5bc' },
  { label: 'Vert pastel',  value: '#a8c5b0' },
  { label: 'Vert foncé',   value: '#4e8c66' },
  { label: 'Texte foncé',  value: '#3a3330' },
  { label: 'Texte moyen',  value: '#7a6e6a' },
  { label: 'Gris doux',    value: '#b0a9a6' },
  { label: 'Blanc cassé',  value: '#f5f2ef' },
  { label: 'Blanc',        value: '#ffffff' },
]

// ── Tailles de texte (5) ─────────────────────────────────────────────────────
const SIZES = [
  { label: 'XS', value: '0.75rem'  },
  { label: 'S',  value: '0.875rem' },
  { label: 'M',  value: '1rem'     },
  { label: 'L',  value: '1.375rem' },
  { label: 'XL', value: '1.875rem' },
]

// ── Valeurs par défaut ────────────────────────────────────────────────────────
const ALL_DEFAULTS: Record<string, Record<string, string>> = {
  hero: {
    accroche:  'Sophrologie & Coaching à Lyon, Giez (Proche Annecy) et visio',
    titre:     'Faire une pause pour mieux oser.',
    sousTitre: "Un espace doux et bienveillant pour vous reconnecter à vous-même, traverser les transitions de vie et révéler vos ressources profondes.",
  },
  quiSuisJe: {
    titre:  'Laetitia Chastel',
    texte1: "Je m'appelle Laetitia, passionnée par l'humain et les parcours de vie. Je me forme au Coaching à la JBS Coaching et à la Sophrologie Caycédienne, dans la continuité d'un chemin déjà tourné vers l'accompagnement.",
    texte2: "Mon goût pour l'écoute et le développement des potentiels s'est d'abord exprimé dans les Ressources Humaines et l'orientation professionnelle. J'y ai découvert combien l'accompagnement peut aider à traverser les transitions et à redonner du sens.",
    texte3: "Chacune de mes expériences m'a rapprochée un peu plus de ce qui m'anime profondément : comprendre l'humain, créer du lien, révéler les ressources.",
  },
  vision: {
    titre:      'Un accompagnement ancré dans le vivant',
    texte1:     "Je crois profondément que chacun porte en lui les ressources nécessaires pour traverser les moments difficiles et se construire une vie qui lui ressemble.",
    texte2:     "Mon rôle n'est pas de vous donner des réponses, mais de créer un espace de confiance où vous pouvez les trouver vous-même — à votre rythme, avec douceur et exigence.",
    conviction: "Les périodes d'incertitude sont des opportunités de se reconnecter à ce qui compte vraiment.",
  },
  coaching: {
    titre:    'Coaching',
    accroche: "De l'intention à l'action",
    texte:    "Le coaching est un espace de réflexion et d'action qui permet de mieux comprendre sa situation actuelle pour construire celle que l'on souhaite vivre.\n\nIl accompagne les périodes de transition, les prises de décision et les envies d'évolution, en aidant chacun à passer de l'intention à l'action.",
  },
  sophrologie: {
    titre:    'Sophrologie',
    accroche: 'Entraîner sa conscience',
    texte:    "La Sophrologie Caycédienne, créée par le psychiatre et professeur Alfonso Caycedo, est une méthode d'accompagnement qui combine la respiration, le mouvement et les évocations positives afin d'amener du mieux-être.\n\nIl s'agit d'un entraînement de la conscience qui permet de développer la conscience de soi et d'activer ses propres ressources au quotidien.",
  },
}

const ENTREPRISES_DEFAULTS: Record<string, Record<string, string>> = {
  entreprisesHero: {
    accroche:  'Sophrologie & Coaching en entreprise',
    titre1:    'Le bien-être de vos équipes,',
    titre2:    'un investissement durable.',
    sousTitre: "Des interventions sur mesure pour réduire le stress, renforcer la cohésion et améliorer la qualité de vie au travail — à Lyon, Giez et en visio.",
  },
  entreprisesBenefices: {
    titre: 'Pourquoi investir dans le bien-être ?',
    b1: "Réduction de l'absentéisme",
    b2: "Regain d'énergie et de motivation",
    b3: "Meilleure cohésion d'équipe",
    b4: "Amélioration de la concentration",
    b5: "Gestion du stress et des émotions",
    b6: "Performance durable",
  },
  entreprisesOffres: {
    titre:        'Des formats adaptés à vos besoins',
    sousTitre:    "Chaque intervention est construite sur mesure après un échange préalable pour cerner vos enjeux et votre culture d'entreprise.",
    offre1_titre: 'Ateliers sophrologie',
    offre1_desc:  "Séances collectives de sophrologie pour apprendre à gérer le stress, retrouver de l'énergie et améliorer la concentration. Format ponctuel ou programme sur plusieurs semaines.",
    offre1_d1: '1h à 1h30 par session', offre1_d2: "Jusqu'à 12 participants", offre1_d3: 'Présentiel ou visio',
    offre2_titre: "Coaching d'équipe",
    offre2_desc:  "Accompagnement collectif pour renforcer la cohésion, clarifier les objectifs communs et améliorer la communication au sein de l'équipe.",
    offre2_d1: 'Demi-journée ou journée', offre2_d2: 'Sur mesure selon vos enjeux', offre2_d3: 'Présentiel ou visio',
    offre3_titre: 'Programme bien-être',
    offre3_desc:  "Programme clé en main combinant sophrologie, coaching individuel et ateliers thématiques pour ancrer durablement le bien-être dans votre entreprise.",
    offre3_d1: 'Sur 4 à 12 semaines', offre3_d2: 'Bilan initial & suivi', offre3_d3: 'Rapport final inclus',
    offre4_titre: 'Conférences & sensibilisation',
    offre4_desc:  "Interventions ponctuelles sur des thématiques comme la gestion du stress, la prévention du burn-out ou la qualité de vie au travail.",
    offre4_d1: '45 min à 1h30', offre4_d2: 'Idéal pour séminaires', offre4_d3: 'Support de présentation fourni',
  },
}

// ── Définition des sections ───────────────────────────────────────────────────
const SECTIONS = [
  {
    key: 'hero',
    label: '🏠 Accueil (Hero)',
    hasPhoto: true,
    photoLabel: 'Photo hero (optionnelle, entre le texte et les boutons)',
    fields: [
      { key: 'accroche',  label: 'Accroche (petit texte coloré)', hasStyle: true },
      { key: 'titre',     label: 'Titre principal',               hasStyle: true },
      { key: 'sousTitre', label: 'Paragraphe intro', multiline: true, hasStyle: true },
      { key: 'photo',     label: 'Photo (URL ou upload)' },
    ],
  },
  {
    key: 'quiSuisJe',
    label: '👤 Qui suis-je ?',
    hasPhoto: true,
    fields: [
      { key: 'titre',  label: 'Titre (nom affiché)',  hasStyle: true },
      { key: 'texte1', label: 'Paragraphe 1', multiline: true },
      { key: 'texte2', label: 'Paragraphe 2', multiline: true },
      { key: 'texte3', label: 'Paragraphe 3', multiline: true },
      { key: 'photo',  label: 'Photo (URL ou upload)' },
    ],
  },
  {
    key: 'vision',
    label: '🌿 Vision',
    fields: [
      { key: 'titre',      label: 'Titre',        hasStyle: true },
      { key: 'texte1',     label: 'Paragraphe 1', multiline: true },
      { key: 'texte2',     label: 'Paragraphe 2', multiline: true },
      { key: 'conviction', label: 'Ma conviction' },
    ],
  },
  {
    key: 'coaching',
    label: '🎯 Coaching',
    fields: [
      { key: 'titre',    label: 'Titre',      hasStyle: true },
      { key: 'accroche', label: 'Sous-titre', hasStyle: true },
      { key: 'texte',    label: 'Texte', multiline: true },
    ],
  },
  {
    key: 'sophrologie',
    label: '🌿 Sophrologie',
    fields: [
      { key: 'titre',    label: 'Titre',      hasStyle: true },
      { key: 'accroche', label: 'Sous-titre', hasStyle: true },
      { key: 'texte',    label: 'Texte', multiline: true },
    ],
  },
  {
    key: 'entreprisesHero',
    label: '🏢 Entreprises – Hero',
    fields: [
      { key: 'accroche',  label: 'Accroche',          hasStyle: true },
      { key: 'titre1',    label: 'Titre – ligne 1',   hasStyle: true },
      { key: 'titre2',    label: 'Titre – ligne 2',   hasStyle: true },
      { key: 'sousTitre', label: 'Paragraphe intro',  multiline: true },
    ],
  },
  {
    key: 'entreprisesBenefices',
    label: '📈 Entreprises – Bénéfices',
    fields: [
      { key: 'titre', label: 'Titre de la section', hasStyle: true },
      { key: 'b1', label: 'Bénéfice 1 (📈)' }, { key: 'b2', label: 'Bénéfice 2 (⚡)' },
      { key: 'b3', label: 'Bénéfice 3 (🤝)' }, { key: 'b4', label: 'Bénéfice 4 (🧠)' },
      { key: 'b5', label: 'Bénéfice 5 (😌)' }, { key: 'b6', label: 'Bénéfice 6 (🏆)' },
    ],
  },
  {
    key: 'entreprisesOffres',
    label: '🎯 Entreprises – Offres',
    fields: [
      { key: 'titre',        label: 'Titre de la section',   hasStyle: true },
      { key: 'sousTitre',    label: 'Sous-titre',            multiline: true },
      { key: 'offre1_titre', label: 'Offre 1 – Titre',       hasStyle: true },
      { key: 'offre1_desc',  label: 'Offre 1 – Description', multiline: true },
      { key: 'offre1_d1',    label: 'Offre 1 – Détail 1' }, { key: 'offre1_d2', label: 'Offre 1 – Détail 2' }, { key: 'offre1_d3', label: 'Offre 1 – Détail 3' },
      { key: 'offre2_titre', label: 'Offre 2 – Titre',       hasStyle: true },
      { key: 'offre2_desc',  label: 'Offre 2 – Description', multiline: true },
      { key: 'offre2_d1',    label: 'Offre 2 – Détail 1' }, { key: 'offre2_d2', label: 'Offre 2 – Détail 2' }, { key: 'offre2_d3', label: 'Offre 2 – Détail 3' },
      { key: 'offre3_titre', label: 'Offre 3 – Titre',       hasStyle: true },
      { key: 'offre3_desc',  label: 'Offre 3 – Description', multiline: true },
      { key: 'offre3_d1',    label: 'Offre 3 – Détail 1' }, { key: 'offre3_d2', label: 'Offre 3 – Détail 2' }, { key: 'offre3_d3', label: 'Offre 3 – Détail 3' },
      { key: 'offre4_titre', label: 'Offre 4 – Titre',       hasStyle: true },
      { key: 'offre4_desc',  label: 'Offre 4 – Description', multiline: true },
      { key: 'offre4_d1',    label: 'Offre 4 – Détail 1' }, { key: 'offre4_d2', label: 'Offre 4 – Détail 2' }, { key: 'offre4_d3', label: 'Offre 4 – Détail 3' },
    ],
  },
  {
    key: 'contact',
    label: '📞 Contact & Réseaux',
    fields: [
      { key: 'adresse',   label: 'Adresse' },
      { key: 'email',     label: 'Email' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'instagram', label: 'Lien Instagram' },
      { key: 'linkedin',  label: 'Lien LinkedIn' },
    ],
  },
]

// ── Composant StylePicker ─────────────────────────────────────────────────────
function StylePicker({
  sectionKey, fieldKey, content, update,
}: {
  sectionKey: string
  fieldKey:   string
  content:    Content
  update:     (s: string, f: string, v: string) => void
}) {
  const colorKey = `${fieldKey}_color`
  const sizeKey  = `${fieldKey}_size`
  const curColor = content[sectionKey]?.[colorKey] || ''
  const curSize  = content[sectionKey]?.[sizeKey]  || ''

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2 p-2.5 bg-blanc-casse/60 rounded-xl border border-rose-pastel/20">
      {/* Couleurs */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-texte/40 mr-0.5">Couleur</span>
        {COLORS.map(c => (
          <button
            key={c.value}
            title={c.label}
            type="button"
            onClick={() => update(sectionKey, colorKey, curColor === c.value ? '' : c.value)}
            className="w-5 h-5 rounded-full transition-all flex-shrink-0"
            style={{
              backgroundColor: c.value,
              outline: curColor === c.value ? '2px solid #3a3330' : '1px solid rgba(0,0,0,0.12)',
              outlineOffset: curColor === c.value ? '2px' : '0px',
              transform: curColor === c.value ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        ))}
        {curColor && (
          <button
            type="button"
            onClick={() => update(sectionKey, colorKey, '')}
            className="text-xs text-texte/30 hover:text-texte/60 ml-1"
            title="Réinitialiser"
          >✕</button>
        )}
      </div>

      {/* Séparateur */}
      <div className="w-px h-4 bg-rose-pastel/40" />

      {/* Tailles */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-texte/40 mr-0.5">Taille</span>
        {SIZES.map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => update(sectionKey, sizeKey, curSize === s.value ? '' : s.value)}
            className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
              curSize === s.value
                ? 'bg-rose-saumon text-white'
                : 'bg-white text-texte/50 hover:bg-rose-pastel/20 border border-rose-pastel/30'
            }`}
          >
            {s.label}
          </button>
        ))}
        {curSize && (
          <button
            type="button"
            onClick={() => update(sectionKey, sizeKey, '')}
            className="text-xs text-texte/30 hover:text-texte/60 ml-1"
            title="Réinitialiser"
          >✕</button>
        )}
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function AdminContent({ adminKey }: { adminKey: string }) {
  const [content,     setContent]     = useState<Content | null>(null)
  const [saved,       setSaved]       = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [openSection, setOpenSection] = useState<string>('hero')
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch(`${BACKEND}/api/admin/content`, { headers: { 'x-admin-key': adminKey } })
      .then(r => r.json())
      .then(data => {
        const merged = { ...data }
        const allDefaults = { ...ALL_DEFAULTS, ...ENTREPRISES_DEFAULTS }
        for (const [key, defaults] of Object.entries(allDefaults)) {
          if (!merged[key] || Object.keys(merged[key]).length === 0) {
            merged[key] = { ...defaults }
          } else {
            merged[key] = { ...defaults, ...merged[key] }
          }
        }
        setContent(merged)
      })
  }, [adminKey])

  const update = (section: string, field: string, value: string) => {
    if (!content) return
    setContent({ ...content, [section]: { ...content[section], [field]: value } })
  }

  const save = async () => {
    setLoading(true)
    await fetch(`${BACKEND}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(content),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  const uploadPhoto = async (file: File, sectionKey: string) => {
    setUploading(true)
    const form = new FormData()
    form.append('image', file)
    const res  = await fetch(`${BACKEND}/api/admin/upload`, {
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
      body: form,
    })
    const data = await res.json()
    if (data.url) update(sectionKey, 'photo', data.url)
    setUploading(false)
  }

  if (!content) return <div className="text-center py-20 text-texte/40">Chargement…</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-texte mb-1">Textes & Images</h2>
        <p className="text-texte/50 text-sm">Les modifications sont appliquées en direct sur le site après sauvegarde.</p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.key} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Accordéon header */}
          <button
            onClick={() => setOpenSection(openSection === section.key ? '' : section.key)}
            className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-blanc-casse/50 transition-colors"
          >
            <span className="font-semibold text-texte">{section.label}</span>
            <svg
              className={`w-5 h-5 text-texte/40 transition-transform ${openSection === section.key ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {openSection === section.key && (
            <div className="px-6 pb-6 space-y-4 border-t border-rose-pastel/20">

              {/* Upload photo */}
              {section.hasPhoto && (
                <div className="pt-4">
                  <label className="block text-sm font-medium text-texte mb-2">
                    {section.photoLabel || 'Photo de profil'}
                  </label>
                  <div className="flex gap-4 items-start">
                    {content[section.key]?.photo && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-rose-pastel/10 relative">
                        <Image
                          src={content[section.key].photo.startsWith('/uploads')
                            ? `${BACKEND}${content[section.key].photo}`
                            : content[section.key].photo}
                          alt="Photo actuelle"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => fileRefs.current[section.key]?.click()}
                        disabled={uploading}
                        className="btn-outline !py-2 !px-4 text-sm disabled:opacity-60"
                      >
                        {uploading ? 'Upload en cours…' : '📁 Changer la photo'}
                      </button>
                      <input
                        ref={el => { fileRefs.current[section.key] = el }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) uploadPhoto(file, section.key)
                        }}
                      />
                      {content[section.key]?.photo && (
                        <button
                          onClick={() => update(section.key, 'photo', '')}
                          className="text-xs text-texte/40 hover:text-rose-saumon transition-colors text-left"
                        >
                          ✕ Supprimer la photo
                        </button>
                      )}
                      <p className="text-xs text-texte/40">JPG, PNG, WebP — max 5 Mo</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Champs */}
              {section.fields.map(field => {
                if (field.key === 'photo') return null
                const val = content[section.key]?.[field.key] || ''
                return (
                  <div key={field.key} className="pt-4 first:pt-0">
                    <label className="block text-sm font-medium text-texte mb-1">{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        rows={4}
                        value={val}
                        onChange={e => update(section.key, field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte text-sm resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => update(section.key, field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte text-sm"
                      />
                    )}
                    {field.hasStyle && (
                      <StylePicker
                        sectionKey={section.key}
                        fieldKey={field.key}
                        content={content}
                        update={update}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      {/* Sauvegarder */}
      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60 min-w-[160px]">
          {saved ? '✅ Sauvegardé !' : loading ? 'Sauvegarde…' : 'Sauvegarder tout'}
        </button>
      </div>
    </div>
  )
}
