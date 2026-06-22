'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { invalidateContent } from '@/hooks/useContent'

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
  { label: 'Violet',       value: '#8b6fba' },
  { label: 'Orange',       value: '#f97316' },
  { label: 'Bleu',         value: '#3b82f6' },
]

// ── Tailles de texte (5) ─────────────────────────────────────────────────────
const SIZES = [
  { label: 'XS',  value: '0.75rem'  },
  { label: 'S',   value: '0.875rem' },
  { label: 'M',   value: '1rem'     },
  { label: 'L',   value: '1.375rem' },
  { label: 'XL',  value: '1.875rem' },
  { label: '2XL', value: '3rem'     },
  { label: '3XL', value: '4.5rem'   },
  { label: 'MAX', value: '6rem'     },   // ≈ taille par défaut du titre hero
]

// ── Alignements ───────────────────────────────────────────────────────────────
const ALIGNMENTS = [
  { value: 'left',    label: '⬅', title: 'Gauche'   },
  { value: 'center',  label: '↔', title: 'Centré'   },
  { value: 'right',   label: '➡', title: 'Droite'   },
  { value: 'justify', label: '≡', title: 'Justifié' },
]

// ── Valeurs par défaut ────────────────────────────────────────────────────────
const ALL_DEFAULTS: Record<string, Record<string, string>> = {
  navbar: {
    lien_accueil:      'Accueil',
    lien_qui_suis_je:  'Qui suis-je ?',
    lien_vision:       'Vision',
    lien_methodes:     'Méthodes',
    lien_coaching:     'Coaching',
    lien_sophrologie:  'Sophrologie',
    lien_qui:          'Pour qui ?',
    lien_entreprises:  'Entreprises',
    lien_contact:      'Contact',
    cta_label:         'Prendre RDV',
  },
  hero: {
    accroche:  'Sophrologie & Coaching à Lyon, Giez (Proche Annecy) et visio',
    titre:     'Faire une pause pour mieux oser.',
    sousTitre: "Un espace doux et bienveillant pour vous reconnecter à vous-même, traverser les transitions de vie et révéler vos ressources profondes.",
  },
  quiSuisJe: {
    label:        'Qui suis-je ?',
    titre:        'Laetitia Chastel',
    texte1:       "Je m'appelle Laetitia, passionnée par l'humain et les parcours de vie. Je me forme au Coaching à la JBS Coaching et à la Sophrologie Caycédienne, dans la continuité d'un chemin déjà tourné vers l'accompagnement.",
    texte2:       "Mon goût pour l'écoute et le développement des potentiels s'est d'abord exprimé dans les Ressources Humaines et l'orientation professionnelle. J'y ai découvert combien l'accompagnement peut aider à traverser les transitions et à redonner du sens.",
    texte3:       "Chacune de mes expériences m'a rapprochée un peu plus de ce qui m'anime profondément : comprendre l'humain, créer du lien, révéler les ressources.",
    // Badge EMCC
    emcc_visible: 'oui',
    emcc_titre:   'Certifiée EMCC',
    emcc_sous:    'JBS Coaching • Sophrologie Caycédienne',
    // Adresse
    adresse_label: '29 place Bellecour — 69002 Lyon',
    visio_visible: 'oui',
    visio_label:   'En visio (France entière)',
  },
  vision: {
    label:      'Ma vision',
    titre:      'Un accompagnement ancré dans le vivant',
    texte1:     "Je crois profondément que chacun porte en lui les ressources nécessaires pour traverser les moments difficiles et se construire une vie qui lui ressemble.",
    texte2:     "Mon rôle n'est pas de vous donner des réponses, mais de créer un espace de confiance où vous pouvez les trouver vous-même — à votre rythme, avec douceur et exigence.",
    conviction: "Les périodes d'incertitude sont des opportunités de se reconnecter à ce qui compte vraiment.",
  },
  coaching: {
    label:    'Méthode',
    titre:    'Coaching',
    accroche: "De l'intention à l'action",
    texte:    "Le coaching est un espace de réflexion et d'action qui permet de mieux comprendre sa situation actuelle pour construire celle que l'on souhaite vivre.\n\nIl accompagne les périodes de transition, les prises de décision et les envies d'évolution, en aidant chacun à passer de l'intention à l'action.",
  },
  sophrologie: {
    label:    'Méthode',
    titre:    'Sophrologie',
    accroche: 'Entraîner sa conscience',
    texte:    "La Sophrologie Caycédienne, créée par le psychiatre et professeur Alfonso Caycedo, est une méthode d'accompagnement qui combine la respiration, le mouvement et les évocations positives afin d'amener du mieux-être.\n\nIl s'agit d'un entraînement de la conscience qui permet de développer la conscience de soi et d'activer ses propres ressources au quotidien.",
  },
  methodes: {
    label: 'Mes méthodes',
    titre: 'Deux approches complémentaires',
  },
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
    offre1_desc:  "Séances collectives de sophrologie pour apprendre à gérer le stress, retrouver de l'énergie et améliorer la concentration.",
    offre1_d1: '1h à 1h30 par session', offre1_d2: "Jusqu'à 12 participants", offre1_d3: 'Présentiel ou visio',
    offre2_titre: "Coaching d'équipe",
    offre2_desc:  "Accompagnement collectif pour renforcer la cohésion, clarifier les objectifs communs et améliorer la communication au sein de l'équipe.",
    offre2_d1: 'Demi-journée ou journée', offre2_d2: 'Sur mesure selon vos enjeux', offre2_d3: 'Présentiel ou visio',
    offre3_titre: 'Programme bien-être',
    offre3_desc:  "Programme clé en main combinant sophrologie, coaching individuel et ateliers thématiques pour ancrer durablement le bien-être.",
    offre3_d1: 'Sur 4 à 12 semaines', offre3_d2: 'Bilan initial & suivi', offre3_d3: 'Rapport final inclus',
    offre4_titre: 'Conférences & sensibilisation',
    offre4_desc:  "Interventions ponctuelles sur des thématiques comme la gestion du stress, la prévention du burn-out ou la qualité de vie au travail.",
    offre4_d1: '45 min à 1h30', offre4_d2: 'Idéal pour séminaires', offre4_d3: 'Support de présentation fourni',
  },
  quiSection: {
    label: 'Pour qui ?',
    titre: "Cet accompagnement est fait pour vous si…",
    intro: "Que vous soyez en plein questionnement, en période de changement ou simplement en quête de mieux-être — il n'y a pas de bonne ou mauvaise raison de se faire accompagner.",
    cta_texte: "Vous vous reconnaissez dans l'un de ces profils ?",
    cta_titre: "Faisons connaissance lors d'un premier échange.",
    cta_bouton: 'Prendre rendez-vous',
  },
  faq: {
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
  },
  devis: {
    titre:     'Parlons de votre projet',
    sousTitre: "Remplissez le formulaire et Laetitia vous recontacte sous 48h pour affiner votre besoin et vous proposer un devis personnalisé.",
    cta:       'Envoyer ma demande de devis →',
    note:      'Réponse sous 48h · Devis gratuit et sans engagement',
    // Listes déroulantes — valeurs séparées par des virgules
    effectifs: '1–10, 11–50, 51–200, 200+',
    besoins:   "Atelier sophrologie, Coaching d'équipe, Programme bien-être, Conférence / Sensibilisation, Autre",
    formats:   'Présentiel Lyon, Présentiel Giez, Visioconférence, Les deux',
  },
  rdvForm: {
    // Type de séance
    s1_label: 'Sophrologie',
    s1_color: '#a8c5b0',
    s2_label: 'Coaching',
    s2_color: '#f0806b',
    s3_label: 'Les deux',
    s3_color: '#8b6fba',
    // Première prise de contact
    fc_question: 'Est-ce votre première prise de contact ?',
    fc_oui:      'Oui, première fois',
    fc_non:      'Non, je connais déjà',
    fc_message:  'Laetitia vous appellera avant le RDV pour mieux comprendre votre besoin et préparer votre séance ensemble.',
    // Bouton
    notes_placeholder: 'Quelques mots pour préparer notre échange…',
    submit_label: 'Confirmer mon rendez-vous →',
    submit_note:  'Un email de confirmation vous sera envoyé après réservation.',
  },
  contact: {
    adresse:             '29 place Bellecour, 69002 Lyon',
    email:               'sophrocoachinglaetitia@gmail.com',
    telephone:           '06 64 43 87 47',
    instagram:           'https://www.instagram.com/laeti.sophrocoach/',
    linkedin:            'https://www.linkedin.com/in/laetitia-chastel/',
    message_placeholder: 'Décrivez brièvement ce qui vous amène…',
  },
}

// ── Type champ ────────────────────────────────────────────────────────────────
type FieldDef = {
  key:           string
  label:         string
  hasStyle?:     boolean   // couleur + taille
  hasAlign?:     boolean   // alignement individuel
  isColorOnly?:  boolean   // seulement un sélecteur de couleur (pour bg boutons)
}

// ── Définition des sections ───────────────────────────────────────────────────
const SECTIONS: {
  key:        string
  label:      string
  hasPhoto?:  boolean
  photoLabel?: string
  fields:     FieldDef[]
}[] = [
  {
    key: 'navbar',
    label: '🧭 Menu de navigation',
    fields: [
      { key: 'lien_accueil',     label: 'Lien Accueil' },
      { key: 'lien_qui_suis_je', label: 'Lien Qui suis-je ?' },
      { key: 'lien_vision',      label: 'Lien Vision' },
      { key: 'lien_methodes',    label: 'Lien Méthodes (parent)' },
      { key: 'lien_coaching',    label: '↳ Sous-lien Coaching' },
      { key: 'lien_sophrologie', label: '↳ Sous-lien Sophrologie' },
      { key: 'lien_qui',         label: 'Lien Pour qui ?' },
      { key: 'lien_entreprises', label: 'Lien Entreprises' },
      { key: 'lien_contact',     label: 'Lien Contact' },
      { key: 'cta_label',        label: 'Bouton CTA (Prendre RDV)' },
    ],
  },
  {
    key: 'hero',
    label: '🏠 Accueil (Hero)',
    hasPhoto: true,
    photoLabel: 'Photo hero (optionnelle, entre le texte et les boutons)',
    fields: [
      { key: 'accroche',  label: 'Accroche (petit texte coloré)', hasStyle: true, hasAlign: true },
      { key: 'titre',     label: 'Titre principal',               hasStyle: true, hasAlign: true },
      { key: 'sousTitre', label: 'Paragraphe intro',              hasStyle: true, hasAlign: true },
    ],
  },
  {
    key: 'quiSuisJe',
    label: '👤 Qui suis-je ?',
    hasPhoto: true,
    fields: [
      { key: 'label',         label: 'Badge (ex : "Qui suis-je ?")' },
      { key: 'titre',         label: 'Titre (nom affiché)',       hasStyle: true, hasAlign: true },
      { key: 'texte1',        label: 'Paragraphe 1',              hasAlign: true },
      { key: 'texte2',        label: 'Paragraphe 2',              hasAlign: true },
      { key: 'texte3',        label: 'Paragraphe 3',              hasAlign: true },
      { key: 'adresse_label', label: 'Lieu (ex : "29 place Bellecour — 69002 Lyon")' },
      { key: 'visio_visible', label: 'Afficher la mention visio ? (oui/non)' },
      { key: 'visio_label',   label: 'Texte visio (ex : "En visio (France entière)")' },
      { key: 'emcc_visible',  label: 'Afficher le badge EMCC ? (oui/non)' },
      { key: 'emcc_titre',    label: 'Badge EMCC – titre',        hasStyle: true },
      { key: 'emcc_sous',     label: 'Badge EMCC – sous-titre' },
    ],
  },
  {
    key: 'vision',
    label: '🌿 Vision',
    fields: [
      { key: 'label',      label: 'Badge (ex : "Ma vision")' },
      { key: 'titre',      label: 'Titre',        hasStyle: true, hasAlign: true },
      { key: 'texte1',     label: 'Paragraphe 1', hasAlign: true },
      { key: 'texte2',     label: 'Paragraphe 2', hasAlign: true },
      { key: 'conviction', label: 'Ma conviction', hasAlign: true },
    ],
  },
  {
    key: 'coaching',
    label: '🎯 Coaching',
    fields: [
      { key: 'label',    label: 'Badge (ex : "Méthode")' },
      { key: 'titre',    label: 'Titre',      hasStyle: true, hasAlign: true },
      { key: 'accroche', label: 'Sous-titre', hasStyle: true, hasAlign: true },
      { key: 'texte',    label: 'Texte',      hasAlign: true },
    ],
  },
  {
    key: 'sophrologie',
    label: '🌿 Sophrologie',
    fields: [
      { key: 'label',    label: 'Badge (ex : "Méthode")' },
      { key: 'titre',    label: 'Titre',      hasStyle: true, hasAlign: true },
      { key: 'accroche', label: 'Sous-titre', hasStyle: true, hasAlign: true },
      { key: 'texte',    label: 'Texte',      hasAlign: true },
    ],
  },
  {
    key: 'methodes',
    label: '🔄 Section Méthodes (titre)',
    fields: [
      { key: 'label', label: 'Badge (ex : "Mes méthodes")' },
      { key: 'titre', label: 'Titre de la section', hasStyle: true, hasAlign: true },
    ],
  },
  {
    key: 'entreprisesHero',
    label: '🏢 Entreprises – Hero',
    fields: [
      { key: 'accroche',  label: 'Accroche',         hasStyle: true, hasAlign: true },
      { key: 'titre1',    label: 'Titre – ligne 1',  hasStyle: true, hasAlign: true },
      { key: 'titre2',    label: 'Titre – ligne 2',  hasStyle: true, hasAlign: true },
      { key: 'sousTitre', label: 'Paragraphe intro', hasStyle: true, hasAlign: true },
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
      { key: 'titre',        label: 'Titre de la section', hasStyle: true },
      { key: 'sousTitre',    label: 'Sous-titre' },
      { key: 'offre1_titre', label: 'Offre 1 – Titre',       hasStyle: true },
      { key: 'offre1_desc',  label: 'Offre 1 – Description' },
      { key: 'offre1_d1', label: 'Offre 1 – Détail 1' }, { key: 'offre1_d2', label: 'Offre 1 – Détail 2' }, { key: 'offre1_d3', label: 'Offre 1 – Détail 3' },
      { key: 'offre2_titre', label: 'Offre 2 – Titre',       hasStyle: true },
      { key: 'offre2_desc',  label: 'Offre 2 – Description' },
      { key: 'offre2_d1', label: 'Offre 2 – Détail 1' }, { key: 'offre2_d2', label: 'Offre 2 – Détail 2' }, { key: 'offre2_d3', label: 'Offre 2 – Détail 3' },
      { key: 'offre3_titre', label: 'Offre 3 – Titre',       hasStyle: true },
      { key: 'offre3_desc',  label: 'Offre 3 – Description' },
      { key: 'offre3_d1', label: 'Offre 3 – Détail 1' }, { key: 'offre3_d2', label: 'Offre 3 – Détail 2' }, { key: 'offre3_d3', label: 'Offre 3 – Détail 3' },
      { key: 'offre4_titre', label: 'Offre 4 – Titre',       hasStyle: true },
      { key: 'offre4_desc',  label: 'Offre 4 – Description' },
      { key: 'offre4_d1', label: 'Offre 4 – Détail 1' }, { key: 'offre4_d2', label: 'Offre 4 – Détail 2' }, { key: 'offre4_d3', label: 'Offre 4 – Détail 3' },
    ],
  },
  {
    key: 'faq',
    label: '❓ FAQ – Questions fréquentes',
    fields: [
      { key: 'label',     label: 'Badge (ex : "Questions fréquentes")' },
      { key: 'titre',     label: 'Titre',     hasStyle: true, hasAlign: true },
      { key: 'sousTitre', label: 'Sous-titre' },
      { key: 'q1', label: 'Question 1' }, { key: 'a1', label: 'Réponse 1' },
      { key: 'q2', label: 'Question 2' }, { key: 'a2', label: 'Réponse 2' },
      { key: 'q3', label: 'Question 3' }, { key: 'a3', label: 'Réponse 3' },
      { key: 'q4', label: 'Question 4' }, { key: 'a4', label: 'Réponse 4' },
      { key: 'q5', label: 'Question 5' }, { key: 'a5', label: 'Réponse 5' },
      { key: 'q6', label: 'Question 6' }, { key: 'a6', label: 'Réponse 6' },
    ],
  },
  {
    key: 'devis',
    label: '📋 Formulaire devis entreprises',
    fields: [
      { key: 'titre',     label: 'Titre de la section', hasStyle: true },
      { key: 'sousTitre', label: 'Sous-titre' },
      { key: 'cta',       label: 'Texte du bouton Envoyer' },
      { key: 'note',      label: 'Note sous le bouton' },
      { key: 'effectifs', label: 'Options Effectif (séparées par des virgules)' },
      { key: 'besoins',   label: "Options Type d'intervention (séparées par des virgules)" },
      { key: 'formats',   label: 'Options Format souhaité (séparées par des virgules)' },
    ],
  },
  {
    key: 'quiSection',
    label: '🙋 Pour qui ?',
    fields: [
      { key: 'label',      label: 'Badge (ex : "Pour qui ?")' },
      { key: 'titre',      label: 'Titre principal',  hasStyle: true, hasAlign: true },
      { key: 'intro',      label: 'Texte intro',      hasAlign: true },
      { key: 'cta_texte',  label: 'CTA – Accroche' },
      { key: 'cta_titre',  label: 'CTA – Titre',      hasStyle: true },
      { key: 'cta_bouton', label: 'CTA – Texte bouton' },
    ],
  },
  {
    key: 'rdvForm',
    label: '📅 Formulaire prise de RDV',
    fields: [
      { key: 's1_label', label: 'Choix 1 – Libellé (ex: Sophrologie)' },
      { key: 's1_color', label: 'Choix 1 – Couleur du bouton actif', isColorOnly: true },
      { key: 's2_label', label: 'Choix 2 – Libellé (ex: Coaching)' },
      { key: 's2_color', label: 'Choix 2 – Couleur du bouton actif', isColorOnly: true },
      { key: 's3_label', label: 'Choix 3 – Libellé (ex: Les deux)' },
      { key: 's3_color', label: 'Choix 3 – Couleur du bouton actif', isColorOnly: true },
      { key: 'fc_question', label: '1ère prise de contact – Question' },
      { key: 'fc_oui',      label: '1ère prise de contact – Bouton Oui' },
      { key: 'fc_non',      label: '1ère prise de contact – Bouton Non' },
      { key: 'fc_message',  label: '1ère prise de contact – Message affiché si Oui' },
      { key: 'notes_placeholder', label: 'Placeholder – "Ce qui vous amène" (formulaire RDV)' },
      { key: 'submit_label', label: 'Texte du bouton Confirmer' },
      { key: 'submit_note',  label: 'Note sous le bouton' },
    ],
  },
  {
    key: 'contact',
    label: '📞 Contact & Réseaux',
    fields: [
      { key: 'adresse',   label: 'Adresse' },
      { key: 'email',     label: 'Email' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'instagram',           label: 'Lien Instagram' },
      { key: 'linkedin',            label: 'Lien LinkedIn' },
      { key: 'message_placeholder', label: 'Placeholder du champ "Message"' },
    ],
  },
]

// ── Historique localStorage ───────────────────────────────────────────────────
const HIST_KEY = 'pose_admin_history'

function loadAllHistory(): Record<string, string[]> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || '{}') } catch { return {} }
}

function pushHistory(section: string, field: string, val: string) {
  if (typeof window === 'undefined' || !val) return
  const all  = loadAllHistory()
  const k    = `${section}__${field}`
  const prev = all[k] || []
  if (prev[0] === val) return
  all[k] = [val, ...prev].slice(0, 5)
  localStorage.setItem(HIST_KEY, JSON.stringify(all))
}

function getFieldHistory(section: string, field: string): string[] {
  return (loadAllHistory()[`${section}__${field}`]) || []
}

// ── Composant FieldControls (couleur + taille + alignement) ──────────────────
function FieldControls({
  sectionKey, fieldKey, content, update, hasStyle, hasAlign, isColorOnly,
}: {
  sectionKey:   string
  fieldKey:     string
  content:      Content
  update:       (s: string, f: string, v: string) => void
  hasStyle?:    boolean
  hasAlign?:    boolean
  isColorOnly?: boolean
}) {
  if (!hasStyle && !hasAlign && !isColorOnly) return null

  // isColorOnly : stocke la couleur directement dans fieldKey (pas fieldKey_color)
  if (isColorOnly) {
    const curColor = content[sectionKey]?.[fieldKey] || ''
    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-2 p-2.5 bg-blanc-casse/60 rounded-xl border border-rose-pastel/20">
        <span className="text-xs text-texte/40 mr-0.5">Couleur du bouton</span>
        {COLORS.map(c => (
          <button key={c.value} title={c.label} type="button"
            onClick={() => update(sectionKey, fieldKey, curColor === c.value ? '' : c.value)}
            className="w-5 h-5 rounded-full transition-all flex-shrink-0"
            style={{
              backgroundColor: c.value,
              outline: curColor === c.value ? '2px solid #3a3330' : '1px solid rgba(0,0,0,0.12)',
              outlineOffset: curColor === c.value ? '2px' : '0px',
              transform: curColor === c.value ? 'scale(1.15)' : 'scale(1)',
            }} />
        ))}
        {curColor && (
          <>
            <div className="w-6 h-6 rounded-full border border-texte/20 flex-shrink-0" style={{ backgroundColor: curColor }} />
            <button type="button" onClick={() => update(sectionKey, fieldKey, '')}
              className="text-xs text-texte/30 hover:text-texte/60" title="Réinitialiser">✕</button>
          </>
        )}
      </div>
    )
  }

  const colorKey = `${fieldKey}_color`
  const sizeKey  = `${fieldKey}_size`
  const alignKey = `_align_${fieldKey}`
  const curColor = content[sectionKey]?.[colorKey] || ''
  const curSize  = content[sectionKey]?.[sizeKey]  || ''
  const curAlign = content[sectionKey]?.[alignKey] || ''

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2 p-2.5 bg-blanc-casse/60 rounded-xl border border-rose-pastel/20">
      {hasStyle && (
        <>
          {/* Couleurs */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-texte/40 mr-0.5">Couleur</span>
            {COLORS.map(c => (
              <button
                key={c.value} title={c.label} type="button"
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
              <button type="button" onClick={() => update(sectionKey, colorKey, '')}
                className="text-xs text-texte/30 hover:text-texte/60 ml-1" title="Réinitialiser">✕</button>
            )}
          </div>

          <div className="w-px h-4 bg-rose-pastel/40" />

          {/* Tailles */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-texte/40 mr-0.5">Taille</span>
            {SIZES.map(s => (
              <button key={s.value} type="button"
                onClick={() => update(sectionKey, sizeKey, curSize === s.value ? '' : s.value)}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
                  curSize === s.value ? 'bg-rose-saumon text-white' : 'bg-white text-texte/50 hover:bg-rose-pastel/20 border border-rose-pastel/30'
                }`}>
                {s.label}
              </button>
            ))}
            {curSize && (
              <button type="button" onClick={() => update(sectionKey, sizeKey, '')}
                className="text-xs text-texte/30 hover:text-texte/60 ml-1" title="Réinitialiser">✕</button>
            )}
          </div>
        </>
      )}

      {hasStyle && hasAlign && <div className="w-px h-4 bg-rose-pastel/40" />}

      {hasAlign && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-texte/40 mr-0.5">Align</span>
          {ALIGNMENTS.map(a => (
            <button key={a.value} type="button" title={a.title}
              onClick={() => update(sectionKey, alignKey, curAlign === a.value ? '' : a.value)}
              className={`px-2 py-0.5 rounded-md text-xs transition-all ${
                curAlign === a.value ? 'bg-rose-saumon text-white' : 'bg-white text-texte/40 hover:bg-rose-pastel/20 border border-rose-pastel/30'
              }`}>
              {a.label}
            </button>
          ))}
          {curAlign && (
            <button type="button" onClick={() => update(sectionKey, alignKey, '')}
              className="text-xs text-texte/30 hover:text-texte/60 ml-1" title="Réinitialiser">✕</button>
          )}
        </div>
      )}
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
  const [histTick,    setHistTick]    = useState(0)

  const fileRefs    = useRef<Record<string, HTMLInputElement | null>>({})
  const focusBefore = useRef<Record<string, string>>({})

  useEffect(() => {
    fetch(`${BACKEND}/api/admin/content`, { headers: { 'x-admin-key': adminKey } })
      .then(r => r.json())
      .then(data => {
        const merged: Content = { ...data }
        for (const [key, defaults] of Object.entries(ALL_DEFAULTS)) {
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

  const handleFocus = (section: string, field: string, currentVal: string) => {
    focusBefore.current[`${section}__${field}`] = currentVal
  }

  const handleBlur = (section: string, field: string, currentVal: string) => {
    const before = focusBefore.current[`${section}__${field}`]
    if (before !== undefined && before !== currentVal) {
      pushHistory(section, field, before)
      setHistTick(t => t + 1)
    }
  }

  const save = async () => {
    setLoading(true)
    await fetch(`${BACKEND}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(content),
    })
    invalidateContent()
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

  void histTick

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-texte mb-1">Textes & Images</h2>
        <p className="text-texte/50 text-sm">Les modifications sont appliquées en direct sur le site après sauvegarde.</p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.key} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === section.key ? '' : section.key)}
            className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-blanc-casse/50 transition-colors"
          >
            <span className="font-semibold text-texte">{section.label}</span>
            <svg className={`w-5 h-5 text-texte/40 transition-transform ${openSection === section.key ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                          alt="Photo actuelle" fill className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 flex-1">
                      {/* Option 1 : URL externe */}
                      <div>
                        <p className="text-xs text-texte/50 mb-1">🔗 URL externe (recommandé)</p>
                        <input
                          type="url"
                          placeholder="https://exemple.com/photo.jpg"
                          value={content[section.key]?.photo?.startsWith('/uploads') ? '' : (content[section.key]?.photo || '')}
                          onChange={e => update(section.key, 'photo', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte text-sm"
                        />
                      </div>
                      {/* Option 2 : Upload fichier */}
                      <div>
                        <p className="text-xs text-texte/50 mb-1">📁 Upload local (perdu au redéploiement)</p>
                        <button onClick={() => fileRefs.current[section.key]?.click()} disabled={uploading}
                          className="btn-outline !py-2 !px-4 text-sm disabled:opacity-60">
                          {uploading ? 'Upload en cours…' : '📁 Choisir un fichier'}
                        </button>
                        <input ref={el => { fileRefs.current[section.key] = el }} type="file" accept="image/*" className="hidden"
                          onChange={e => { const file = e.target.files?.[0]; if (file) uploadPhoto(file, section.key) }} />
                      </div>
                      {content[section.key]?.photo && (
                        <button onClick={() => update(section.key, 'photo', '')}
                          className="text-xs text-texte/40 hover:text-rose-saumon transition-colors text-left">
                          ✕ Supprimer la photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Champs */}
              {section.fields.map(field => {
                const val        = content[section.key]?.[field.key] ?? ''
                const defaultVal = ALL_DEFAULTS[section.key]?.[field.key] ?? ''
                const history    = getFieldHistory(section.key, field.key)
                const isModified = !!defaultVal && val !== defaultVal

                return (
                  <div key={field.key} className="pt-4 first:pt-0">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-texte">{field.label}</label>
                      {isModified && (
                        <button type="button"
                          onClick={() => {
                            pushHistory(section.key, field.key, val)
                            update(section.key, field.key, defaultVal)
                            setHistTick(t => t + 1)
                          }}
                          title={`Revenir à : "${defaultVal.slice(0, 40)}${defaultVal.length > 40 ? '…' : ''}"`}
                          className="text-xs text-texte/30 hover:text-rose-saumon transition-colors flex items-center gap-1">
                          ↺ Défaut
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={val.includes('\n') ? Math.min(val.split('\n').length + 1, 8) : 2}
                      value={val}
                      onChange={e => update(section.key, field.key, e.target.value)}
                      onFocus={() => handleFocus(section.key, field.key, val)}
                      onBlur={e => handleBlur(section.key, field.key, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 focus:outline-none focus:border-rose-saumon text-texte text-sm resize-y"
                    />

                    <FieldControls
                      sectionKey={section.key}
                      fieldKey={field.key}
                      content={content}
                      update={update}
                      hasStyle={field.hasStyle}
                      hasAlign={field.hasAlign}
                      isColorOnly={field.isColorOnly}
                    />

                    {history.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                        <span className="text-xs text-texte/30">Historique :</span>
                        {history.map((hval, hi) => (
                          <button key={hi} type="button" onClick={() => update(section.key, field.key, hval)}
                            title={hval}
                            className="text-xs text-texte/40 hover:text-rose-saumon underline underline-offset-2 transition-colors">
                            {hval.length > 30 ? hval.slice(0, 30) + '…' : hval}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end pb-10">
        <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60 min-w-[160px]">
          {saved ? '✅ Sauvegardé !' : loading ? 'Sauvegarde…' : 'Sauvegarder tout'}
        </button>
      </div>
    </div>
  )
}
