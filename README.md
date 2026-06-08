# P.ose – Sophrologie & Coaching · Laetitia Chastel

Site vitrine one-page pour sophrologue & coach à Lyon.

## Stack

- **Next.js 14** (export statique)
- **Tailwind CSS**
- **TypeScript**
- **Déploiement** : Render (static site) + GitHub

---

## 1. Installation locale

```bash
cd laeti_sophro
npm install
```

Copier le fichier d'environnement :
```bash
cp .env.local.example .env.local
# puis remplir les valeurs dans .env.local
```

Lancer en développement :
```bash
npm run dev
# → http://localhost:3000
```

---

## 2. Police Champagne & Limousines

1. Télécharger sur [dafont.com](https://www.dafont.com/champagne-limousines.font)
2. Placer `Champagne & Limousines.ttf` et `Champagne & Limousines Bold.ttf` dans `/public/fonts/`

---

## 3. Déploiement sur Render (static site)

1. **GitHub** : pousser ce repo sur GitHub
2. **Render** → New → Static Site
3. Paramètres :
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `out`
4. Variables d'environnement : ajouter celles de `.env.local.example`
5. Custom domain : brancher le domaine OVH → nameservers Cloudflare → Cloudflare CNAME vers Render

---

## 4. Structure du projet

```
src/
├── app/
│   ├── layout.tsx               # Layout global + SEO + Schema.org
│   ├── page.tsx                 # Page d'accueil (one-page)
│   ├── rdv/page.tsx             # Page prise de RDV
│   ├── mentions-legales/
│   ├── politique-confidentialite/
│   └── politique-cookies/
└── components/
    ├── Navbar.tsx               # Menu sticky avec sous-menu Méthodes
    ├── Footer.tsx
    ├── CookieBanner.tsx         # RGPD
    └── sections/
        ├── Hero.tsx
        ├── Vision.tsx
        ├── Methodes.tsx         # Coaching + Sophrologie
        ├── QuiSuisJe.tsx
        └── ContactSection.tsx
```

---

## 5. À faire (prochaines étapes)

- [ ] Ajouter la vraie photo de Laetitia dans `QuiSuisJe.tsx`
- [ ] Intégrer Google Calendar API dans `/rdv`
- [ ] Configurer Resend pour les emails de confirmation RDV
- [ ] Créer le backend admin (repo séparé) pour l'édition des textes/images
- [ ] Ajouter Google My Business pour le SEO local Lyon
- [ ] Mettre à jour le SIRET dans les mentions légales
- [ ] Mettre à jour l'URL dans `layout.tsx` et `README` avec le vrai domaine

---

## 6. Palette de couleurs

| Nom            | Hex       |
|----------------|-----------|
| Vert pastel    | `#add3a0` |
| Rose pastel    | `#e4a189` |
| Rose saumon    | `#f0806b` |
| Blanc cassé    | `#f5f2ef` |
| Texte          | `#3a3330` |
