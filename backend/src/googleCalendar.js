const { google } = require('googleapis')

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

async function createCalendarEvent({ start, end, summary, location, clientName, clientEmail, clientPhone, notes }) {
  const calendar   = google.calendar({ version: 'v3', auth: getAuth() })
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  const event = await calendar.events.insert({
    calendarId,
    sendNotifications: false,
    requestBody: {
      summary,
      location,
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
    },
  })

  return event.data
}

module.exports = { createCalendarEvent }
