const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

/**
 * Email de confirmation au client
 */
async function sendConfirmationToClient({ clientName, clientEmail, type, start, end }) {
  await transporter.sendMail({
    from: `"P.ose Sophrologie" <${process.env.GMAIL_USER}>`,
    to:   clientEmail,
    subject: `✅ Votre RDV ${type} est confirmé`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3a3330;">
        <div style="background: #f5f2ef; padding: 40px; border-radius: 16px;">
          <h1 style="color: #f0806b; margin-bottom: 8px;">Votre rendez-vous est confirmé !</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre séance de <strong>${type}</strong> a bien été enregistrée.</p>

          <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #f0806b;">
            <p style="margin: 0;"><strong>📅 Date :</strong> ${formatDate(start)}</p>
            <p style="margin: 8px 0 0;"><strong>⏱️ Durée :</strong> 1 heure</p>
            <p style="margin: 8px 0 0;"><strong>📍 Lieu :</strong> 29 place Bellecour, 69002 Lyon<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ou en visioconférence selon accord)</p>
          </div>

          <p>En cas d'empêchement, merci de prévenir <strong>au moins 48h à l'avance</strong> :</p>
          <p>
            📧 <a href="mailto:${process.env.SOPHRO_EMAIL}" style="color: #f0806b;">${process.env.SOPHRO_EMAIL}</a><br>
            📞 06 64 43 87 47
          </p>

          <p style="color: #888; font-size: 14px; margin-top: 32px;">
            À très bientôt,<br>
            <strong style="color: #3a3330;">${process.env.SOPHRO_NAME}</strong><br>
            Sophrologue &amp; Coach certifiée EMCC
          </p>
        </div>
      </div>
    `,
  })
}

/**
 * Notification à Laetitia pour un nouveau RDV
 */
async function sendNotificationToSophro({ clientName, clientEmail, clientPhone, type, start, notes }) {
  await transporter.sendMail({
    from:    `"P.ose – Nouveau RDV" <${process.env.GMAIL_USER}>`,
    to:      process.env.SOPHRO_EMAIL,
    replyTo: clientEmail,
    subject: `📅 Nouveau RDV ${type} – ${clientName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3a3330;">
        <div style="background: #f5f2ef; padding: 40px; border-radius: 16px;">
          <h1 style="color: #f0806b;">Nouveau rendez-vous !</h1>

          <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p><strong>👤 Client :</strong> ${clientName}</p>
            <p><strong>📧 Email :</strong> <a href="mailto:${clientEmail}" style="color: #f0806b;">${clientEmail}</a></p>
            ${clientPhone ? `<p><strong>📞 Téléphone :</strong> ${clientPhone}</p>` : ''}
            <p><strong>🎯 Type :</strong> ${type}</p>
            <p><strong>📅 Date :</strong> ${formatDate(start)}</p>
            ${notes ? `<p><strong>📝 Notes :</strong> ${notes}</p>` : ''}
          </div>

          <p style="color: #888; font-size: 13px;">
            Cet événement a été ajouté automatiquement à votre Google Agenda.
          </p>
        </div>
      </div>
    `,
  })
}

/**
 * Email de confirmation devis entreprise au demandeur
 */
async function sendEntrepriseConfirmation({ contact, societe, email }) {
  await transporter.sendMail({
    from:    `"P.ose Sophrologie & Coaching" <${process.env.GMAIL_USER}>`,
    to:      email,
    subject: 'Votre demande de devis a bien été reçue',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3a3330;">
        <div style="background: #f5f2ef; padding: 40px; border-radius: 16px;">
          <h2 style="color: #f0806b;">Merci pour votre demande !</h2>
          <p>Bonjour ${contact},</p>
          <p>Votre demande de devis pour <strong>${societe}</strong> a bien été reçue.</p>
          <p>Laetitia vous recontactera sous <strong>48h</strong> pour discuter de votre projet.</p>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">
            ${process.env.SOPHRO_NAME}<br>
            Sophrologue &amp; Coach certifiée EMCC<br>
            <a href="mailto:${process.env.SOPHRO_EMAIL}" style="color: #f0806b;">${process.env.SOPHRO_EMAIL}</a>
          </p>
        </div>
      </div>
    `,
  })
}

/**
 * Notification devis entreprise à Laetitia
 */
async function sendEntrepriseNotification({ societe, contact, email, telephone, effectif, besoin, format, message }) {
  await transporter.sendMail({
    from:    `"P.ose – Demande Entreprise" <${process.env.GMAIL_USER}>`,
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
}

/**
 * Notification à Laetitia pour un message contact
 */
async function sendContactNotification({ nom, email, telephone, message }) {
  await transporter.sendMail({
    from:    `"P.ose – Message Contact" <${process.env.GMAIL_USER}>`,
    to:      process.env.SOPHRO_EMAIL,
    replyTo: email,
    subject: `✉️ Nouveau message de ${nom}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; color: #3a3330;">
        <div style="background: #f5f2ef; padding: 32px; border-radius: 16px;">
          <h2 style="color: #f0806b;">Nouveau message via le site</h2>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr><td style="padding:6px 0; color:#888; width:120px;">Nom</td><td style="font-weight:600">${nom}</td></tr>
            <tr><td style="padding:6px 0; color:#888">Email</td><td><a href="mailto:${email}" style="color:#f0806b">${email}</a></td></tr>
            ${telephone ? `<tr><td style="padding:6px 0; color:#888">Téléphone</td><td>${telephone}</td></tr>` : ''}
          </table>
          <div style="margin-top:16px; background:white; padding:16px; border-radius:8px; font-size:14px; line-height:1.6">${message}</div>
        </div>
      </div>
    `,
  })
}

/**
 * Confirmation au visiteur qui a envoyé un message
 */
async function sendContactConfirmation({ nom, email }) {
  await transporter.sendMail({
    from:    `"P.ose Sophrologie & Coaching" <${process.env.GMAIL_USER}>`,
    to:      email,
    subject: 'Votre message a bien été reçu',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; color: #3a3330;">
        <div style="background: #f5f2ef; padding: 40px; border-radius: 16px;">
          <h2 style="color: #f0806b;">Merci pour votre message !</h2>
          <p>Bonjour ${nom},</p>
          <p>Votre message a bien été reçu. Laetitia vous répondra dans les meilleurs délais.</p>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">
            ${process.env.SOPHRO_NAME}<br>
            Sophrologue &amp; Coach certifiée EMCC
          </p>
        </div>
      </div>
    `,
  })
}

module.exports = {
  sendConfirmationToClient,
  sendNotificationToSophro,
  sendEntrepriseConfirmation,
  sendEntrepriseNotification,
  sendContactNotification,
  sendContactConfirmation,
}
