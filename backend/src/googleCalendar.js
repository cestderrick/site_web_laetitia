const { google } = require('googleapis')

/**
 * Retourne un client Google Calendar authentifié via Service Account
 */
function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  return google.calendar({ version: 'v3', auth })
}

/**
 * Retourne les créneaux libres pour les 30 prochains jours
 * en excluant les événements existants du calendrier.
 */
async function getAvailableSlots(daysAhead = 30) {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const slotDuration = parseInt(process.env.SLOT_DURATION_MINUTES || '60', 10)
  const startHour = parseInt((process.env.AVAILABILITY_START || '09:00').split(':')[0], 10)
  const endHour   = parseInt((process.env.AVAILABILITY_END   || '19:00').split(':')[0], 10)
  const availableDays = (process.env.AVAILABILITY_DAYS || '1,2,3,4,5')
    .split(',').map(Number)

  const now   = new Date()
  const until = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

  // Récupérer tous les événements existants
  const eventsRes = await calendar.events.list({
    calendarId,
    timeMin: now.toISOString(),
    timeMax: until.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  })

  const busyPeriods = (eventsRes.data.items || [])
    .filter(e => e.status !== 'cancelled')
    .map(e => ({
      start: new Date(e.start.dateTime || e.start.date),
      end:   new Date(e.end.dateTime   || e.end.date),
    }))

  // Générer tous les créneaux potentiels
  const slots = []
  const cursor = new Date(now)
  cursor.setHours(startHour, 0, 0, 0)
  if (cursor < now) cursor.setDate(cursor.getDate() + 1)

  while (cursor < until) {
    const dayOfWeek = cursor.getDay()
    if (availableDays.includes(dayOfWeek)) {
      for (let h = startHour; h + slotDuration / 60 <= endHour; h += slotDuration / 60) {
        const slotStart = new Date(cursor)
        slotStart.setHours(h, 0, 0, 0)
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000)

        if (slotStart <= now) continue // passé

        // Vérifier qu'aucun événement existant ne chevauche ce créneau
        const isOccupied = busyPeriods.some(
          (b) => b.start < slotEnd && b.end > slotStart
        )

        if (!isOccupied) {
          slots.push({
            start: slotStart.toISOString(),
            end:   slotEnd.toISOString(),
          })
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return slots
}

/**
 * Crée un événement dans le calendrier de Laetitia
 */
async function createBooking({ start, end, clientName, clientEmail, clientPhone, type, notes }) {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const event = await calendar.events.insert({
    calendarId,
    sendNotifications: true,
    requestBody: {
      summary: `RDV ${type} – ${clientName}`,
      description: [
        `Type : ${type}`,
        `Nom : ${clientName}`,
        `Email : ${clientEmail}`,
        clientPhone ? `Téléphone : ${clientPhone}` : '',
        notes ? `Notes : ${notes}` : '',
      ].filter(Boolean).join('\n'),
      start: { dateTime: start, timeZone: 'Europe/Paris' },
      end:   { dateTime: end,   timeZone: 'Europe/Paris' },
      attendees: [
        { email: clientEmail, displayName: clientName },
        { email: process.env.SOPHRO_EMAIL, displayName: process.env.SOPHRO_NAME },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email',  minutes: 60 * 24 }, // 24h avant
          { method: 'popup',  minutes: 30 },
        ],
      },
    },
  })

  return event.data
}

module.exports = { getAvailableSlots, createBooking }
