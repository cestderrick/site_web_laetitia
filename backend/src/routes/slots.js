const express = require('express')
const { getAvailableSlots } = require('../googleCalendar')
const router = express.Router()

// GET /api/slots?days=30
router.get('/', async (req, res) => {
  try {
    const days  = parseInt(req.query.days || '30', 10)
    const slots = await getAvailableSlots(days)
    res.json({ slots })
  } catch (err) {
    console.error('Erreur slots:', err.message)
    res.status(500).json({ error: 'Impossible de récupérer les créneaux.' })
  }
})

module.exports = router
