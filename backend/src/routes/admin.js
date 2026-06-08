const express  = require('express')
const fs       = require('fs')
const path     = require('path')
const multer   = require('multer')

const router = express.Router()

const SLOTS_CONFIG_PATH = path.join(__dirname, '../data/slots-config.json')
const CONTENT_PATH      = path.join(__dirname, '../data/content.json')
const UPLOADS_DIR       = path.join(__dirname, '../../public/uploads')

// Créer le dossier uploads si besoin
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Middleware auth simple ────────────────────────────────────────────────────
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
    const ext  = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Fichier non image refusé.'))
  },
})

// ── SLOTS CONFIG ──────────────────────────────────────────────────────────────

// GET /api/admin/slots-config  (public, lu par le frontend RDV aussi)
router.get('/slots-config', (_req, res) => {
  const config = JSON.parse(fs.readFileSync(SLOTS_CONFIG_PATH, 'utf-8'))
  res.json(config)
})

// PUT /api/admin/slots-config  (admin only)
router.put('/slots-config', requireAdmin, (req, res) => {
  const config = req.body
  fs.writeFileSync(SLOTS_CONFIG_PATH, JSON.stringify(config, null, 2))
  res.json({ success: true })
})

// ── CONTENT ───────────────────────────────────────────────────────────────────

// GET /api/admin/content  (public, lu par le frontend)
router.get('/content', (_req, res) => {
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
  res.json(content)
})

// PUT /api/admin/content  (admin only)
router.put('/content', requireAdmin, (req, res) => {
  const current = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
  const updated = { ...current, ...req.body }
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(updated, null, 2))
  res.json({ success: true, content: updated })
})

// POST /api/admin/upload  (admin only)
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' })
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, url })
})

module.exports = { router, requireAdmin }
