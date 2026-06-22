const express = require('express')
const crypto  = require('crypto')
const { updateSlotRow } = require('../googleSheets')
const { createCalendarEvent, updateCalendarEventToBooking } = require('../googleCalendar')
const { sendConfirmationToClient, sendNotificationToSophro } = require('../email')
const router = express.Router()

function generateJitsiLink() {
  const id = crypto.randomBytes(5).toString('hex') // ex: "a3f9c2b1e0"
  return `https://meet.jit.si/PoseCoach-${id}`
}

// Couleurs Google Calendar
// 3 = Grape (violet foncé) → présentiel
// 9 = Blueberry (bleu foncé) → visio
const COLOR_PRESENTIEL = '3'
const COLOR_VISIO      = '9'

// POST /api/booking
// Body: { slotId, chosenMode, clientName, clientEmail, clientPhone?, notes? }
router.post('/', async (req, res) => {
  const { slotId, chosenMode, clientName, clientEmail, clientPhone, notes, sessionType, isFirstContact } = req.body

  if (!slotId || !chosenMode || !clientName || !clientEmail) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  try {
    // 1. Récupérer le créneau et vérifier sa disponibilité
    const { getAllSlots } = require('../googleSheets')
    const allSlots = await getAllSlots()
    const slot = allSlots.find(s => s.id === slotId)

    if (!slot)                       return res.status(404).json({ error: 'Créneau introuvable.' })
    if (slot.status !== 'available') return res.status(409).json({ error: "Ce créneau n'est plus disponible." })

    const startISO = `${slot.date}T${slot.startTime}:00`
    const endISO   = `${slot.date}T${slot.endTime}:00`

    const locationLabel = chosenMode === 'visio'
      ? 'Visioconférence'
      : slot.location === 'Lyon'
        ? '29 place Bellecour, 69002 Lyon'
        : 'Giez (Proche Annecy)'

    const summary  = `RDV ${chosenMode === 'visio' ? 'Visio' : slot.location} – ${clientName}`
    const colorId  = chosenMode === 'visio' ? COLOR_VISIO : COLOR_PRESENTIEL

    // 2. Générer un lien Jitsi unique pour les RDV visio
    const meetLink = chosenMode === 'visio' ? generateJitsiLink() : null

    // 3. Mettre à jour l'événement GCal existant OU en créer un nouveau
    let eventId = slot.calendarEventId
    if (eventId) {
      const event = await updateCalendarEventToBooking({
        eventId, start: startISO, end: endISO,
        summary, location: locationLabel,
        clientName, clientEmail, clientPhone, notes, colorId, meetLink,
      })
      eventId = event.id
    } else {
      const event = await createCalendarEvent({
        start: startISO, end: endISO,
        summary, location: locationLabel,
        clientName, clientEmail, clientPhone, notes, colorId, meetLink,
      })
      eventId = event.id
    }

    // 4. Marquer le créneau comme réservé dans Google Sheets
    await updateSlotRow(slotId, {
      status: 'booked',
      clientName, clientEmail, clientPhone: clientPhone || '',
      calendarEventId: eventId,
      notes: notes || '',
    })

    // 5. Emails de confirmation (non-bloquant)
    const type = chosenMode === 'visio' ? 'Visio' : `Présentiel – ${slot.location}`
    Promise.all([
      sendConfirmationToClient({ clientName, clientEmail, type, location: locationLabel, start: startISO, end: endISO, meetLink, sessionType }),
      sendNotificationToSophro({ clientName, clientEmail, clientPhone, type, location: locationLabel, start: startISO, notes, meetLink, sessionType, isFirstContact }),
    ]).catch(err => console.error('Erreur envoi email RDV (non-bloquant):', err.message))

    res.json({ success: true, eventId, message: 'Rendez-vous confirmé !' })
  } catch (err) {
    console.error('Erreur booking:', err.message)
    res.status(500).json({ error: 'Erreur lors de la réservation. Veuillez réessayer.' })
  }
})

module.exports = router
