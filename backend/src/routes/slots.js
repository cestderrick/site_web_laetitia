const express = require('express')
const { getAvailableSlots } = require('../googleSheets')
const router = express.Router()

// GET /api/slots  — créneaux disponibles pour le frontend RDV
router.get('/', async (_req, res) => {
  try {
    const slots = await getAvailableSlots()
    res.json({ slots })
  } catch (err) {
    console.error('Erreur slots:', err.message)
    res.status(500).json({ error: 'Impossible de récupérer les créneaux.' })
  }
})

module.exports = router
