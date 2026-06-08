const { google } = require('googleapis')

const SHEET_ID = process.env.GOOGLE_SHEET_ID

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
    ],
  })
}

function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getAuth() })
}

// ── Slots ─────────────────────────────────────────────────────────────────────
// Colonnes : id | date | startTime | endTime | durationMinutes | location | allowVisio | status | clientName | clientEmail | clientPhone | calendarEventId | notes | createdAt

const SLOTS_RANGE  = 'slots!A:N'
const SLOTS_HEADER = ['id','date','startTime','endTime','durationMinutes','location','allowVisio','status','clientName','clientEmail','clientPhone','calendarEventId','notes','createdAt']

function rowToSlot(row) {
  const [id, date, startTime, endTime, durationMinutes, location, allowVisio, status,
         clientName, clientEmail, clientPhone, calendarEventId, notes, createdAt] = row
  return { id, date, startTime, endTime, durationMinutes: Number(durationMinutes),
           location, allowVisio: allowVisio === 'true',
           status, clientName, clientEmail, clientPhone, calendarEventId, notes, createdAt }
}

async function getAllSlots() {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SLOTS_RANGE })
  const rows = res.data.values || []
  if (rows.length <= 1) return [] // seulement les headers
  return rows.slice(1).map(rowToSlot)
}

async function getAvailableSlots() {
  const slots = await getAllSlots()
  const now   = new Date()
  return slots.filter(s => {
    if (s.status !== 'available') return false
    const slotDate = new Date(`${s.date}T${s.startTime}:00`)
    return slotDate > now
  })
}

async function addSlots(slotsArray) {
  const sheets = getSheetsClient()
  // Vérifier si les headers existent
  const check = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'slots!A1:N1' })
  if (!check.data.values || check.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID, range: 'slots!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [SLOTS_HEADER] },
    })
  }
  const rows = slotsArray.map(s => [
    s.id, s.date, s.startTime, s.endTime, s.durationMinutes,
    s.location, String(s.allowVisio), 'available',
    '', '', '', '', '', new Date().toISOString(),
  ])
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID, range: SLOTS_RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  })
}

async function updateSlotRow(id, patch) {
  const sheets = getSheetsClient()
  const res    = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SLOTS_RANGE })
  const rows   = res.data.values || []
  const idx    = rows.findIndex((r, i) => i > 0 && r[0] === id)
  if (idx === -1) throw new Error(`Créneau ${id} introuvable`)

  const current = rowToSlot(rows[idx])
  const updated = { ...current, ...patch }
  const newRow  = [
    updated.id, updated.date, updated.startTime, updated.endTime,
    updated.durationMinutes, updated.location, String(updated.allowVisio),
    updated.status, updated.clientName || '', updated.clientEmail || '',
    updated.clientPhone || '', updated.calendarEventId || '',
    updated.notes || '', updated.createdAt,
  ]
  const rowNum = idx + 1 // 1-indexed, headers on row 1
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `slots!A${rowNum}:N${rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [newRow] },
  })
  return rowToSlot(newRow)
}

async function deleteSlotRow(id) {
  const sheets   = getSheetsClient()
  const res      = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SLOTS_RANGE })
  const rows     = res.data.values || []
  const idx      = rows.findIndex((r, i) => i > 0 && r[0] === id)
  if (idx === -1) throw new Error(`Créneau ${id} introuvable`)

  // Récupérer l'ID de la feuille "slots"
  const meta   = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
  const sheet  = meta.data.sheets.find(s => s.properties.title === 'slots')
  const sheetId = sheet.properties.sheetId

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: 'ROWS', startIndex: idx, endIndex: idx + 1 },
        },
      }],
    },
  })
}

// ── Content ───────────────────────────────────────────────────────────────────
// Colonnes : section | field | value

const CONTENT_RANGE  = 'content!A:C'
const CONTENT_HEADER = ['section', 'field', 'value']

async function getContent() {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: CONTENT_RANGE })
  const rows = (res.data.values || []).slice(1)
  const content = {}
  for (const [section, field, value] of rows) {
    if (!content[section]) content[section] = {}
    content[section][field] = value || ''
  }
  return content
}

async function setContent(contentObj) {
  const sheets = getSheetsClient()
  const rows   = [CONTENT_HEADER]
  for (const [section, fields] of Object.entries(contentObj)) {
    for (const [field, value] of Object.entries(fields)) {
      rows.push([section, field, value])
    }
  }
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID, range: CONTENT_RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  })
}

async function initContentIfEmpty(defaultContent) {
  const sheets = getSheetsClient()
  const res    = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'content!A1:A2' })
  if (!res.data.values || res.data.values.length <= 1) {
    await setContent(defaultContent)
  }
}

// ── Reviews ───────────────────────────────────────────────────────────────────
// Colonnes : id | author | rating | date | text | createdAt

const REVIEWS_RANGE  = 'reviews!A:F'
const REVIEWS_HEADER = ['id', 'author', 'rating', 'date', 'text', 'createdAt']

function rowToReview(row) {
  const [id, author, rating, date, text, createdAt] = row
  return { id, author, rating: Number(rating), date, text, createdAt }
}

async function getReviews() {
  const sheets = getSheetsClient()
  const res    = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: REVIEWS_RANGE })
  const rows   = res.data.values || []
  if (rows.length <= 1) return []
  return rows.slice(1).map(rowToReview)
}

async function addReview(review) {
  const sheets = getSheetsClient()
  // Ajouter le header si la feuille est vide
  const check = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'reviews!A1:F1' })
  if (!check.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID, range: 'reviews!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [REVIEWS_HEADER] },
    })
  }
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID, range: REVIEWS_RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: [[review.id, review.author, review.rating, review.date, review.text, new Date().toISOString()]] },
  })
}

async function deleteReview(id) {
  const sheets  = getSheetsClient()
  const res     = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: REVIEWS_RANGE })
  const rows    = res.data.values || []
  const idx     = rows.findIndex((r, i) => i > 0 && r[0] === id)
  if (idx === -1) throw new Error(`Avis ${id} introuvable`)

  const meta    = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
  const sheet   = meta.data.sheets.find(s => s.properties.title === 'reviews')
  const sheetId = sheet.properties.sheetId

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { requests: [{ deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: idx, endIndex: idx + 1 } } }] },
  })
}

module.exports = {
  getAllSlots, getAvailableSlots, addSlots, updateSlotRow, deleteSlotRow,
  getContent, setContent, initContentIfEmpty,
  getReviews, addReview, deleteReview,
}
