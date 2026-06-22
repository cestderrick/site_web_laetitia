const { google } = require('googleapis')

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

function getMeetLink(eventData) {
  // Lien Meet depuis l'event GCal, ou fallback sur l'URL fixe en variable d'env
  return eventData.conferenceData?.entryPoints
    ?.find(e => e.entryPointType === 'video')?.uri
    || process.env.MEET_FALLBACK_URL
    || null
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
async function updateCalendarEventToBooking({ eventId, start, end, summary, location, clientName, clientEmail, clientPhone, notes, colorId }) {
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const isVisio    = colorId === '9'

  const requestBody = {
    summary,
    location,
    colorId: String(colorId),
    description: [
      `Client : ${clientName}`,
      `Email  : ${clientEmail}`,
      clientPhone ? `Tél    : ${clientPhone}` : '',
      notes       ? `Notes  : ${notes}`       : '',
    ].filter(Boolean).join('\n'),
    start: { dateTime: start, timeZone: 'Europe/Paris' },
    end:   { dateTime: end,   timeZone: 'Europe/Paris' },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 * 24 },
        { method: 'popup', minutes: 30 },
      ],
    },
  }

  if (isVisio) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: `meet-${eventId}-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    }
  }

  const event = await calendar.events.patch({
    calendarId,
    eventId,
    conferenceDataVersion: isVisio ? 1 : 0,
    sendNotifications: false,
    requestBody,
  })

  return { ...event.data, meetLink: getMeetLink(event.data) }
}

// ── Crée un nouvel événement de RDV (fallback si pas d'eventId existant) ─────
async function createCalendarEvent({ start, end, summary, location, clientName, clientEmail, clientPhone, notes, colorId }) {
  const calendar   = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const isVisio    = colorId === '9'

  const requestBody = {
    summary,
    location,
    colorId: colorId ? String(colorId) : undefined,
    description: [
      `Client : ${clientName}`,
      `Email  : ${clientEmail}`,
      clientPhone ? `Tél    : ${clientPhone}` : '',
      notes       ? `Notes  : ${notes}`       : '',
    ].filter(Boolean).join('\n'),
    start: { dateTime: start, timeZone: 'Europe/Paris' },
    end:   { dateTime: end,   timeZone: 'Europe/Paris' },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 * 24 },
        { method: 'popup', minutes: 30 },
      ],
    },
  }

  if (isVisio) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    }
  }

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: isVisio ? 1 : 0,
    sendNotifications: false,
    requestBody,
  })

  return { ...event.data, meetLink: getMeetLink(event.data) }
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
