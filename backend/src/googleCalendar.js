const { google } = require('googleapis')

// ── Helpers timezone Paris ────────────────────────────────────────────────────

/**
 * Retourne l'offset UTC de Paris pour une date donnée ('+02:00' en été, '+01:00' en hiver).
 * @param {string} dateStr  ex: '2024-06-15'
 */
function getParisTzOffset(dateStr) {
  const d = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Paris',
    timeZoneName: 'shortOffset',
  }).formatToParts(new Date(`${dateStr}T12:00:00Z`))
  const tzName = d.find(p => p.type === 'timeZoneName')?.value ?? 'GMT+1'
  const m = tzName.match(/GMT([+-])(\d+)(?::(\d+))?/)
  if (!m) return '+01:00'
  const sign  = m[1]
  const hours = m[2].padStart(2, '0')
  const mins  = (m[3] ?? '0').padStart(2, '0')
  return `${sign}${hours}:${mins}`
}

/**
 * Construit un ISO 8601 complet avec offset Paris explicite.
 * ex: toParisISO('2024-06-15', '09:00') → '2024-06-15T09:00:00+02:00'
 * @param {string} date  ex: '2024-06-15'
 * @param {string} time  ex: '9:00' ou '09:00'
 */
function toParisISO(date, time) {
  const [h, mPart] = time.split(':')
  const normalizedTime = `${h.padStart(2, '0')}:${(mPart || '00').padStart(2, '0')}`
  return `${date}T${normalizedTime}:00${getParisTzOffset(date)}`
}

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

  const startISO = toParisISO(slot.date, slot.startTime)
  const endISO   = toParisISO(slot.date, slot.endTime)

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
      colorId:     '2', // Sage (vert)
      start: { dateTime: startISO, timeZone: 'Europe/Paris' },
      end:   { dateTime: endISO,   timeZone: 'Europe/Paris' },
      reminders: { useDefault: false, overrides: [] }, // aucun rappel
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
          { method: 'popup', minutes: 15 },
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
          { method: 'popup', minutes: 15 },
        ],
      },
    },
  })

  return event.data
}

// ── Vérifie les conflits sur un calendrier secondaire (agenda perso) ─────────

/**
 * Retourne les plages occupées d'un calendrier secondaire sur une plage donnée.
 * @param {string} startDate  ex: '2024-06-15'
 * @param {string} endDate    ex: '2024-06-15' (peut être différent pour le generate)
 * @returns {Array<{start:string, end:string}>}  plages occupées en UTC ISO
 */
async function getAllBusyIntervals(startDate, endDate) {
  const calId = process.env.GOOGLE_SECONDARY_CALENDAR_ID
  if (!calId) return []

  const calendar = getCalendarClient()
  const offset   = getParisTzOffset(startDate)
  const timeMin  = `${startDate}T00:00:00${offset}`
  const timeMax  = `${endDate}T23:59:59${getParisTzOffset(endDate)}`

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: 'Europe/Paris',
      items: [{ id: calId }],
    },
  })

  return res.data.calendars?.[calId]?.busy ?? []
}

/**
 * Vérifie si un créneau unique entre en conflit avec le calendrier secondaire.
 * @returns {boolean} true = conflit détecté
 */
async function checkFreeBusy(date, startTime, endTime) {
  const busyIntervals = await getAllBusyIntervals(date, date)
  if (!busyIntervals.length) return false

  const slotStart = new Date(toParisISO(date, startTime))
  const slotEnd   = new Date(toParisISO(date, endTime))

  return busyIntervals.some(b => {
    const bStart = new Date(b.start)
    const bEnd   = new Date(b.end)
    return slotStart < bEnd && slotEnd > bStart
  })
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
  toParisISO,
  checkFreeBusy,
  getAllBusyIntervals,
  createAvailableSlotEvent,
  updateCalendarEventToBooking,
  createCalendarEvent,
  deleteCalendarEvent,
}
