const express = require('express')
const { sendEntrepriseConfirmation, sendEntrepriseNotification } = require('../email')
const router  = express.Router()

// POST /api/contact/entreprise
router.post('/entreprise', async (req, res) => {
  const { societe, contact, email, telephone, effectif, besoin, format, message } = req.body
  if (!societe || !contact || !email) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  try {
    await sendEntrepriseNotification({ societe, contact, email, telephone, effectif, besoin, format, message })
    await sendEntrepriseConfirmation({ contact, societe, email })
    res.json({ success: true })
  } catch (err) {
    console.error('Erreur contact entreprise:', err.message)
    res.status(500).json({ error: "Erreur d'envoi. Réessayez ou contactez directement Laetitia." })
  }
})

module.exports = router
