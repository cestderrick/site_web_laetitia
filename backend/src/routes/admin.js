const express = require('express')
const path    = require('path')
const fs      = require('fs')
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid')
const {
  getAllSlots, addSlots, updateSlotRow, deleteSlotRow,
  getContent, setContent,
  getReviews, addReview, deleteReview,
} = require('../googleSheets')
const { toParisISO, checkFreeBusy, getAllBusyIntervals, createAvailableSlotEvent, updateCalendarEventToBooking, deleteCalendarEvent } = require('../googleCalendar')

const router     = express.Router()
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Auth ──────────────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Non autorisé.' })
  }
  next()
}

// ── Upload images ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_r, f, cb) => f.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Image uniquement'))
})

// ── VERIFY ───────────────────────────────────────────────────────────────────
router.get('/verify', requireAdmin, (_req, res) => res.json({ ok: true }))

// ── SLOTS ─────────────────────────────────────────────────────────────────────

// GET /api/admin/slots  (admin)
router.get('/slots', requireAdmin, async (_req, res) => {
  try {
    const slots = await getAllSlots()
    res.json({ slots })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/slots/generate  (admin) — génération en masse
// Body: { startDate, endDate, days[], startTime, endTime, durationMinutes, location, allowVisio, interval }
router.post('/slots/generate', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, days, startTime, endTime, durationMinutes, location, allowVisio } = req.body

    const start    = new Date(startDate)
    const end      = new Date(endDate)
    const dur      = Number(durationMinutes)
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const endMins  = eh * 60 + em
    const newSlots = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (!days.includes(d.getDay())) continue
      const dateStr = d.toISOString().slice(0, 10)
      let cursor = sh * 60 + sm
      while (cursor + dur <= endMins) {
        const hStart = String(Math.floor(cursor / 60)).padStart(2, '0')
        const mStart = String(cursor % 60).padStart(2, '0')
        const endC   = cursor + dur
        const hEnd   = String(Math.floor(endC / 60)).padStart(2, '0')
        const mEnd   = String(endC % 60).padStart(2, '0')
        newSlots.push({
          id: uuidv4(),
          date: dateStr,
          startTime: `${hStart}:${mStart}`,
          endTime:   `${hEnd}:${mEnd}`,
          durationMinutes: dur,
          location,
          allowVisio: Boolean(allowVisio),
        })
        cursor += dur
      }
    }

    // Vérifier les conflits sur le calendrier secondaire (si configuré)
    let safeSlots   = newSlots
    let skippedCount = 0
    try {
      if (process.env.GOOGLE_SECONDARY_CALENDAR_ID && newSlots.length > 0) {
        const busyIntervals = await getAllBusyIntervals(startDate, endDate)
        if (busyIntervals.length > 0) {
          safeSlots = newSlots.filter(slot => {
            const slotStart = new Date(toParisISO(slot.date, slot.startTime))
            const slotEnd   = new Date(toParisISO(slot.date, slot.endTime))
            return !busyIntervals.some(b => {
              const bStart = new Date(b.start)
              const bEnd   = new Date(b.end)
              return slotStart < bEnd && slotEnd > bStart
            })
          })
          skippedCount = newSlots.length - safeSlots.length
        }
      }
    } catch (conflictErr) {
      console.warn('Vérification conflits agenda secondaire échouée (non-bloquant):', conflictErr.message)
    }

    // Écrire d'abord dans Google Sheets
    if (safeSlots.length > 0) await addSlots(safeSlots)

    // Créer les événements GCal en parallèle (non-bloquant si erreur)
    Promise.allSettled(safeSlots.map(async slot => {
      const event = await createAvailableSlotEvent(slot)
      await updateSlotRow(slot.id, { calendarEventId: event.id })
    })).then(results => {
      const failed = results.filter(r => r.status === 'rejected').length
      if (failed > 0) console.warn(`${failed}/${safeSlots.length} événements GCal non créés`)
    })

    res.json({ success: true, count: safeSlots.length, skipped: skippedCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/slots  (admin) — ajouter un créneau unique
router.post('/slots', requireAdmin, async (req, res) => {
  try {
    const { date, startTime, endTime, durationMinutes, location, allowVisio } = req.body

    // Vérifier les conflits sur le calendrier secondaire
    try {
      const hasConflict = await checkFreeBusy(date, startTime, endTime)
      if (hasConflict) {
        return res.status(409).json({
          error: `Conflit détecté sur votre agenda personnel pour ce créneau (${startTime}–${endTime}).`,
          conflict: true,
        })
      }
    } catch (conflictErr) {
      console.warn('Vérification conflits échouée (non-bloquant):', conflictErr.message)
    }

    const slot = { id: uuidv4(), date, startTime, endTime, durationMinutes: Number(durationMinutes), location, allowVisio: Boolean(allowVisio) }
    await addSlots([slot])

    // Créer l'événement GCal "Créneau disponible" et stocker son ID
    try {
      const event = await createAvailableSlotEvent(slot)
      await updateSlotRow(slot.id, { calendarEventId: event.id })
      slot.calendarEventId = event.id
    } catch (calErr) {
      console.error('GCal event creation failed (non-bloquant):', calErr.message)
    }

    res.json({ success: true, slot })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/admin/slots/:id  (admin) — modifier
router.put('/slots/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await updateSlotRow(req.params.id, req.body)
    res.json({ success: true, slot: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/slots/:id/release  — remet un créneau réservé à "available"
router.post('/slots/:id/release', requireAdmin, async (req, res) => {
  try {
    const allSlots = await getAllSlots()
    const slot = allSlots.find(s => s.id === req.params.id)
    if (!slot) return res.status(404).json({ error: 'Créneau introuvable.' })

    // Remettre le statut à available + effacer les infos client
    await updateSlotRow(req.params.id, {
      status: 'available',
      clientName: '', clientEmail: '', clientPhone: '',
      notes: '', calendarEventId: slot.calendarEventId || '',
    })

    // Remettre l'event GCal à "Créneau disponible" (couleur grise)
    if (slot.calendarEventId) {
      const startISO = toParisISO(slot.date, slot.startTime)
      const endISO   = toParisISO(slot.date, slot.endTime)
      updateCalendarEventToBooking({
        eventId:     slot.calendarEventId,
        start:       startISO,
        end:         endISO,
        summary:     `🗓️ Créneau disponible – ${slot.location}`,
        location:    slot.location === 'Lyon' ? '29 place Bellecour, 69002 Lyon' : 'Giez (Proche Annecy)',
        clientName:  'Créneau libéré',
        clientEmail: '', clientPhone: '', notes: '', meetLink: null,
        colorId:     '8', // Graphite
      }).catch(() => {}) // non-bloquant
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/slots/:id  (admin)
router.delete('/slots/:id', requireAdmin, async (req, res) => {
  try {
    // Récupérer le calendarEventId avant suppression pour nettoyer GCal
    const allSlots = await getAllSlots()
    const slot = allSlots.find(s => s.id === req.params.id)
    if (slot?.calendarEventId) {
      deleteCalendarEvent(slot.calendarEventId).catch(() => {}) // non-bloquant
    }
    await deleteSlotRow(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── CONTENT ───────────────────────────────────────────────────────────────────

router.get('/content', async (_req, res) => {
  try {
    res.json(await getContent())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/content', requireAdmin, async (req, res) => {
  try {
    const current = await getContent()
    const merged  = { ...current, ...req.body }
    await setContent(merged)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── UPLOAD ────────────────────────────────────────────────────────────────────
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' })
  res.json({ success: true, url: `/uploads/${req.file.filename}` })
})

// ── REVIEWS ───────────────────────────────────────────────────────────────────

// GET /api/admin/reviews  (public — lu aussi par le build script)
router.get('/reviews', async (_req, res) => {
  try {
    const reviews = await getReviews()
    res.json({ reviews })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/reviews  (admin)
router.post('/reviews', requireAdmin, async (req, res) => {
  try {
    const { author, rating, date, text } = req.body
    if (!author || !rating || !text) return res.status(400).json({ error: 'Champs requis manquants.' })
    const review = { id: uuidv4(), author, rating: Number(rating), date: date || '', text }
    await addReview(review)
    res.json({ success: true, review })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/reviews/:id  (admin)
router.delete('/reviews/:id', requireAdmin, async (req, res) => {
  try {
    await deleteReview(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = { router, requireAdmin }
