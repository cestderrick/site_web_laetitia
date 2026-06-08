require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const slotsRouter        = require('./routes/slots')
const bookingRouter      = require('./routes/booking')
const { router: adminRouter } = require('./routes/admin')

const app  = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Servir les images uploadées
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// Routes
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/slots',   slotsRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin',   adminRouter)

app.listen(PORT, () => {
  console.log(`✅ Backend P.ose démarré sur http://localhost:${PORT}`)
})
