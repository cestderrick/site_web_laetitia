const express = require('express')
const path    = require('path')
const fs      = require('fs')
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid')
const {
  getAllSlots, addSlots, updateSlotRow, deleteSlotRow,
  getContent, setContent,
} = require('../googleSheets')

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

    await addSlots(newSlots)
    res.json({ success: true, count: newSlots.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/slots  (admin) — ajouter un créneau unique
router.post('/slots', requireAdmin, async (req, res) => {
  try {
    const { date, startTime, endTime, durationMinutes, location, allowVisio } = req.body
    const slot = { id: uuidv4(), date, startTime, endTime, durationMinutes: Number(durationMinutes), location, allowVisio: Boolean(allowVisio) }
    await addSlots([slot])
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

// DELETE /api/admin/slots/:id  (admin)
router.delete('/slots/:id', requireAdmin, async (req, res) => {
  try {
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

module.exports = { router, requireAdmin }
