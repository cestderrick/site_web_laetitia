/**
 * Script exécuté avant `next build`.
 * Récupère les avis depuis le backend (Google Sheets) et les écrit dans public/reviews.json.
 *
 * Variable d'env nécessaire (Service 1 sur Render) :
 *   NEXT_PUBLIC_BACKEND_URL — URL du backend (ex: https://pose-backend.onrender.com)
 */

import fs   from 'fs'
import path from 'path'

const BACKEND  = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
const OUT_FILE = path.join(process.cwd(), 'public', 'reviews.json')

// Fonction fetch avec retry pour gérer le cold start du backend Render
async function fetchWithRetry(url, retries = 3, delayMs = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (res.ok) return res
      throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      if (i < retries - 1) {
        console.log(`⏳ Backend pas encore prêt, retry dans ${delayMs / 1000}s… (${i + 1}/${retries})`)
        await new Promise(r => setTimeout(r, delayMs))
      } else {
        throw err
      }
    }
  }
}

try {
  console.log(`📡 Récupération des avis depuis ${BACKEND}…`)
  const res  = await fetchWithRetry(`${BACKEND}/api/admin/reviews`)
  const data = await res.json()

  const reviews = data.reviews || []

  if (reviews.length === 0) {
    console.log('ℹ️  Aucun avis à publier — reviews.json non généré.')
    process.exit(0)
  }

  const payload = { reviews, fetchedAt: new Date().toISOString() }
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf-8')
  console.log(`✅ ${reviews.length} avis écrits dans public/reviews.json`)
} catch (err) {
  console.log(`⚠️  Impossible de récupérer les avis (${err.message}) — section masquée.`)
  process.exit(0) // ne pas bloquer le build
}
