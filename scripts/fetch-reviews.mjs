/**
 * Script exécuté avant `next build` pour récupérer les avis Google Places
 * et les stocker dans public/reviews.json (fichier statique servi par le site).
 *
 * Variables d'env nécessaires (Service 1 sur Render) :
 *   NEXT_PUBLIC_GOOGLE_PLACE_ID   — Place ID Google
 *   GOOGLE_PLACES_API_KEY         — Clé API Places (pas besoin de NEXT_PUBLIC ici)
 */

import fs   from 'fs'
import path from 'path'

const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJR2xafuDr9EcRRioXLswDybg'
const API_KEY  = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || ''

const OUT_FILE = path.join(process.cwd(), 'public', 'reviews.json')

if (!API_KEY) {
  console.log('⚠️  Aucune clé Google Places — reviews.json ignoré.')
  process.exit(0)
}

const url =
  `https://maps.googleapis.com/maps/api/place/details/json` +
  `?place_id=${PLACE_ID}` +
  `&fields=reviews%2Crating%2Cuser_ratings_total` +
  `&language=fr` +
  `&reviews_sort=newest` +
  `&key=${API_KEY}`

try {
  const res  = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK') {
    console.error('❌ Google Places error:', data.status, data.error_message || '')
    process.exit(0) // ne pas bloquer le build
  }

  const payload = {
    reviews: (data.result.reviews || []).map(r => ({
      author: r.author_name,
      photo:  r.profile_photo_url || null,
      rating: r.rating,
      date:   r.relative_time_description,
      text:   r.text,
    })),
    rating: data.result.rating        || null,
    total:  data.result.user_ratings_total || null,
    fetchedAt: new Date().toISOString(),
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf-8')
  console.log(`✅ ${payload.reviews.length} avis Google écrits dans public/reviews.json`)
} catch (err) {
  console.error('❌ Erreur fetch-reviews:', err.message)
  process.exit(0) // ne pas bloquer le build
}
