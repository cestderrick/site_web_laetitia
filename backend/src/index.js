require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app  = express()
const PORT = process.env.PORT || 4000

// Accepter plusieurs origines séparées par virgule dans FRONTEND_URL
// ex: "https://site.onrender.com,https://www.pose-sophro.fr"
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',').map(s => s.trim()).filter(Boolean)

app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, cb) => {
        // Autoriser les requêtes sans origin (Postman, curl) + les origines listées
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
        cb(new Error(`CORS bloqué pour l'origin: ${origin}`))
      }
    : '*',
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    googleSheet:    !!process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SHEET_ID !== 'COLLER_L_ID_ICI',
    googleCalendar: !!process.env.GOOGLE_CALENDAR_ID,
    resend:         !!process.env.RESEND_API_KEY,
  })
})

// Middleware : avertir si Google Sheets pas encore configuré
app.use('/api/slots',   (req, res, next) => {
  if (!process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID === 'COLLER_L_ID_ICI') {
    return res.json({ slots: [], warning: 'Google Sheets non configuré.' })
  }
  next()
})
app.use('/api/booking', (req, res, next) => {
  if (!process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID === 'COLLER_L_ID_ICI') {
    return res.status(503).json({ error: 'Réservation indisponible — Google Sheets non configuré.' })
  }
  next()
})

app.use('/api/slots',   require('./routes/slots'))
app.use('/api/booking', require('./routes/booking'))
app.use('/api/admin',   require('./routes/admin').router)
app.use('/api/contact', require('./routes/contact'))
app.use('/api/reviews', require('./routes/reviews'))

app.listen(PORT, () => {
  console.log(`✅ Backend P.ose démarré sur http://localhost:${PORT}`)
  if (!process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID === 'COLLER_L_ID_ICI') {
    console.log('⚠️  GOOGLE_SHEET_ID non configuré — créneaux désactivés jusqu\'à setup.')
  }
})
