const express = require('express')
const { createBooking } = require('../googleCalendar')
const { sendConfirmationToClient, sendNotificationToSophro } = require('../email')
const router = express.Router()

// POST /api/booking
// Body: { start, end, type, clientName, clientEmail, clientPhone?, notes? }
router.post('/', async (req, res) => {
  const { start, end, type, clientName, clientEmail, clientPhone, notes } = req.body

  // Validation basique
  if (!start || !end || !type || !clientName || !clientEmail) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  try {
    // 1. Créer l'événement dans Google Agenda
    const event = await createBooking({
      start, end, type, clientName, clientEmail, clientPhone, notes,
    })

    // 2. Emails de confirmation (en parallèle)
    await Promise.all([
      sendConfirmationToClient({ clientName, clientEmail, type, start, end }),
      sendNotificationToSophro({ clientName, clientEmail, clientPhone, type, start, notes }),
    ])

    res.json({
      success: true,
      eventId: event.id,
      message: 'Rendez-vous confirmé ! Un email vous a été envoyé.',
    })
  } catch (err) {
    console.error('Erreur booking:', err.message)
    res.status(500).json({ error: 'Erreur lors de la réservation. Veuillez réessayer ou contacter Laetitia directement.' })
  }
})

module.exports = router
