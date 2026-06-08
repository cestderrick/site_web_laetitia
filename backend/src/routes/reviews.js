const express = require('express')
const router  = express.Router()

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJR2xafuDr9EcRRioXLswDybg'

// Cache simple en mémoire (1 heure) pour éviter de taper l'API à chaque visite
let cache = null
let cacheAt = 0
const TTL  = 60 * 60 * 1000 // 1 h

// GET /api/reviews
router.get('/', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return res.json({ reviews: [], rating: null, total: null, warning: 'GOOGLE_PLACES_API_KEY non configurée.' })
  }

  // Retourner le cache si encore frais
  if (cache && Date.now() - cacheAt < TTL) {
    return res.json(cache)
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}` +
      `&fields=reviews%2Crating%2Cuser_ratings_total` +
      `&language=fr` +
      `&reviews_sort=newest` +
      `&key=${apiKey}`

    const response = await fetch(url)
    const data     = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Places error:', data.status, data.error_message)
      return res.status(502).json({ error: `Google Places: ${data.status}` })
    }

    const payload = {
      reviews: (data.result.reviews || []).map(r => ({
        author:  r.author_name,
        photo:   r.profile_photo_url || null,
        rating:  r.rating,
        date:    r.relative_time_description,
        text:    r.text,
      })),
      rating: data.result.rating,
      total:  data.result.user_ratings_total,
    }

    cache   = payload
    cacheAt = Date.now()

    res.json(payload)
  } catch (err) {
    console.error('Erreur reviews:', err.message)
    res.status(500).json({ error: 'Impossible de récupérer les avis.' })
  }
})

module.exports = router
