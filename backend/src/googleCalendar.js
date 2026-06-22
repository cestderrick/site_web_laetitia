const { google } = require('googleapis')

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}


function getCalendarClient() {
  return google.calendar({ version: 'v3', auth: getAuth() })
}

// ── Crée un événement "Créneau disponible" quand l'admin ajoute un créneau ────
async function createAvailableSlotEvent(slot) {
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const startISO = `${slot.date}T${slot.startTime}:00`
  const endISO   = `${slot.date}T${slot.endTime}:00`

  const locationLabel = slot.location === 'Lyon'
    ? '29 place Bellecour, 69002 Lyon'
    : 'Giez (Proche Annecy)'

  const modeInfo = slot.allowVisio
    ? 'Présentiel ou visio'
    : 'Présentiel uniquement'

  const event = await calendar.events.insert({
    calendarId,
    sendNotifications: false,
    requestBody: {
      summary:     `🗓️ Créneau disponible – ${slot.location}`,
      location:    locationLabel,
      description: `Créneau ouvert à la réservation sur le site.\n${modeInfo}`,
      colorId:     '8', // Graphite (gris)
      start: { dateTime: startISO, timeZone: 'Europe/Paris' },
      end:   { dateTime: endISO,   timeZone: 'Europe/Paris' },
    },
  })

  return event.data
}

// ── Met à jour l'événement existant quand un RDV est pris ────────────────────
async function updateCalendarEventToBooking({ eventId, start, end, summary, location, clientName, clientEmail, clientPhone, notes, colorId, meetLink }) {
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const descLines = [
    `Client : ${clientName}`,
    `Email  : ${clientEmail}`,
    clientPhone ? `Tél    : ${clientPhone}` : '',
    meetLink    ? `Visio  : ${meetLink}`     : '',
    notes       ? `Notes  : ${notes}`        : '',
  ].filter(Boolean)

  const event = await calendar.events.patch({
    calendarId,
    eventId,
    sendNotifications: false,
    requestBody: {
      summary,
      location: meetLink ? `${location} — ${meetLink}` : location,
      colorId: String(colorId),
      description: descLines.join('\n'),
      start: { dateTime: start, timeZone: 'Europe/Paris' },
      end:   { dateTime: end,   timeZone: 'Europe/Paris' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 },
          { method: 'popup', minutes: 30 },
        ],
      },
    },
  })

  return event.data
}

// ── Crée un nouvel événement de RDV (fallback si pas d'eventId existant) ─────
async function createCalendarEvent({ start, end, summary, location, clientName, clientEmail, clientPhone, notes, colorId, meetLink }) {
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const descLines = [
    `Client : ${clientName}`,
    `Email  : ${clientEmail}`,
    clientPhone ? `Tél    : ${clientPhone}` : '',
    meetLink    ? `Visio  : ${meetLink}`     : '',
    notes       ? `Notes  : ${notes}`        : '',
  ].filter(Boolean)

  const event = await calendar.events.insert({
    calendarId,
    sendNotifications: false,
    requestBody: {
      summary,
      location: meetLink ? `${location} — ${meetLink}` : location,
      colorId: colorId ? String(colorId) : undefined,
      description: descLines.join('\n'),
      start: { dateTime: start, timeZone: 'Europe/Paris' },
      end:   { dateTime: end,   timeZone: 'Europe/Paris' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 },
          { method: 'popup', minutes: 30 },
        ],
      },
    },
  })

  return event.data
}

// ── Supprime un événement du calendrier ──────────────────────────────────────
async function deleteCalendarEvent(eventId) {
  if (!eventId) return
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  await calendar.events.delete({ calendarId, eventId }).catch(() => {
    // Ignorer si déjà supprimé
  })
}

module.exports = {
  createAvailableSlotEvent,
  updateCalendarEventToBooking,
  createCalendarEvent,
  deleteCalendarEvent,
}
