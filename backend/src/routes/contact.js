const express  = require('express')
const { Resend } = require('resend')
const router   = express.Router()
const resend   = new Resend(process.env.RESEND_API_KEY)

// POST /api/contact/entreprise
router.post('/entreprise', async (req, res) => {
  const { societe, contact, email, telephone, effectif, besoin, format, message } = req.body
  if (!societe || !contact || !email) {
    return res.status(400).json({ error: 'Champs requis manquants.' })
  }

  try {
    await resend.emails.send({
      from:    `P.ose – Demande Entreprise <${process.env.FROM_EMAIL}>`,
      to:      process.env.SOPHRO_EMAIL,
      replyTo: email,
      subject: `🏢 Demande devis entreprise – ${societe}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #3a3330;">
          <div style="background: #f5f2ef; padding: 32px; border-radius: 16px;">
            <h2 style="color: #f0806b; margin-bottom: 16px;">Nouvelle demande entreprise</h2>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:6px 0; color:#888; width:160px;">Société</td><td style="font-weight:600">${societe}</td></tr>
              <tr><td style="padding:6px 0; color:#888">Contact</td><td>${contact}</td></tr>
              <tr><td style="padding:6px 0; color:#888">Email</td><td><a href="mailto:${email}" style="color:#f0806b">${email}</a></td></tr>
              ${telephone ? `<tr><td style="padding:6px 0; color:#888">Téléphone</td><td>${telephone}</td></tr>` : ''}
              <tr><td style="padding:6px 0; color:#888">Effectif</td><td>${effectif || '–'}</td></tr>
              <tr><td style="padding:6px 0; color:#888">Intervention</td><td>${besoin || '–'}</td></tr>
              <tr><td style="padding:6px 0; color:#888">Format</td><td>${format || '–'}</td></tr>
            </table>
            ${message ? `<div style="margin-top:16px; background:white; padding:16px; border-radius:8px; font-size:14px; line-height:1.6">${message}</div>` : ''}
          </div>
        </div>
      `,
    })

    // Email de confirmation au demandeur
    await resend.emails.send({
      from:    `P.ose Sophrologie & Coaching <${process.env.FROM_EMAIL}>`,
      to:      email,
      subject: 'Votre demande de devis a bien été reçue',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #3a3330;">
          <div style="background: #f5f2ef; padding: 32px; border-radius: 16px;">
            <h2 style="color: #f0806b;">Merci pour votre demande !</h2>
            <p>Bonjour ${contact},</p>
            <p>Votre demande de devis pour <strong>${societe}</strong> a bien été reçue.</p>
            <p>Laetitia vous recontactera sous <strong>48h</strong> pour discuter de votre projet.</p>
            <p style="color:#888; font-size:13px; margin-top:24px;">
              ${process.env.SOPHRO_NAME}<br>
              Sophrologue &amp; Coach certifiée EMCC<br>
              <a href="mailto:${process.env.SOPHRO_EMAIL}" style="color:#f0806b">${process.env.SOPHRO_EMAIL}</a>
            </p>
          </div>
        </div>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Erreur contact entreprise:', err.message)
    res.status(500).json({ error: "Erreur d'envoi. Réessayez ou contactez directement Laetitia." })
  }
})

module.exports = router
