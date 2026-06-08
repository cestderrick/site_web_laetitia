const express = require('express')
const { updateSlotRow } = require('../googleSheets')
const { createCalendarEvent } = require('../googleCalendar')
const { sendConfirmationToClient, sendNotificationToSophro } = require('../email')
const router = express.Router()

// POST /api/booking
// Body: { slotId, chosenMode, clientName, clientEmail, clientPhone?, notes? }
router.post('/', async (req, res) => {
  const { slotId, chosenMode, clientName, clientEmail, clientPhone, notes } = req.body

  if (!slotId || !chosenMode || !clientName || !clientEmail) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  try {
    // 1. Récupérer le créneau et vérifier sa disponibilité
    const { getAllSlots } = require('../googleSheets')
    const allSlots = await getAllSlots()
    const slot = allSlots.find(s => s.id === slotId)

    if (!slot)                      return res.status(404).json({ error: 'Créneau introuvable.' })
    if (slot.status !== 'available') return res.status(409).json({ error: "Ce créneau n'est plus disponible." })

    // 2. Créer l'événement Google Calendar
    const startISO = `${slot.date}T${slot.startTime}:00`
    const endISO   = `${slot.date}T${slot.endTime}:00`

    const locationLabel = chosenMode === 'visio'
      ? 'Visioconférence'
      : slot.location === 'Lyon'
        ? '29 place Bellecour, 69002 Lyon'
        : 'Giez (Proche Annecy)'

    const event = await createCalendarEvent({
      start: startISO, end: endISO,
      summary:  `RDV ${chosenMode === 'visio' ? 'Visio' : slot.location} – ${clientName}`,
      location: locationLabel,
      clientName, clientEmail, clientPhone, notes,
    })

    // 3. Marquer le créneau comme réservé dans Google Sheets
    await updateSlotRow(slotId, {
      status: 'booked',
      clientName, clientEmail, clientPhone: clientPhone || '',
      calendarEventId: event.id,
      notes: notes || '',
    })

    // 4. Emails de confirmation
    await Promise.all([
      sendConfirmationToClient({ clientName, clientEmail, chosenMode, location: locationLabel, start: startISO, end: endISO }),
      sendNotificationToSophro({ clientName, clientEmail, clientPhone, chosenMode, location: locationLabel, start: startISO, notes }),
    ])

    res.json({ success: true, eventId: event.id, message: 'Rendez-vous confirmé !' })
  } catch (err) {
    console.error('Erreur booking:', err.message)
    res.status(500).json({ error: 'Erreur lors de la réservation. Veuillez réessayer.' })
  }
})

module.exports = router
