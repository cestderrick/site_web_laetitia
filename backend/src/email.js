const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM    = `P.ose Sophrologie <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`
const SOPHRO  = process.env.SOPHRO_EMAIL
const NAME    = process.env.SOPHRO_NAME

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

async function sendConfirmationToClient({ clientName, clientEmail, type, location, start }) {
  await resend.emails.send({
    from:    FROM,
    to:      clientEmail,
    replyTo: SOPHRO,
    subject: `✅ Votre RDV est confirmé`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#3a3330">
        <div style="background:#f5f2ef;padding:40px;border-radius:16px">
          <h1 style="color:#f0806b">Votre rendez-vous est confirmé !</h1>
          <p>Bonjour ${clientName},</p>
          <p>Votre séance <strong>${type}</strong> a bien été enregistrée.</p>
          <div style="background:white;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #f0806b">
            <p style="margin:0"><strong>📅 Date :</strong> ${formatDate(start)}</p>
            <p style="margin:8px 0 0"><strong>📍 Lieu :</strong> ${location}</p>
          </div>
          <p>En cas d'empêchement, merci de prévenir <strong>au moins 48h à l'avance</strong> :</p>
          <p>📧 <a href="mailto:${SOPHRO}" style="color:#f0806b">${SOPHRO}</a></p>
          <p style="color:#888;font-size:14px;margin-top:32px">À très bientôt,<br><strong style="color:#3a3330">${NAME}</strong><br>Sophrologue &amp; Coach certifiée EMCC</p>
        </div>
      </div>`,
  })
}

async function sendNotificationToSophro({ clientName, clientEmail, clientPhone, type, location, start, notes }) {
  await resend.emails.send({
    from:    FROM,
    to:      SOPHRO,
    replyTo: clientEmail,
    subject: `📅 Nouveau RDV ${type} – ${clientName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;color:#3a3330">
        <div style="background:#f5f2ef;padding:40px;border-radius:16px">
          <h1 style="color:#f0806b">Nouveau rendez-vous !</h1>
          <div style="background:white;border-radius:12px;padding:20px;margin:24px 0">
            <p><strong>👤</strong> ${clientName}</p>
            <p><strong>📧</strong> <a href="mailto:${clientEmail}" style="color:#f0806b">${clientEmail}</a></p>
            ${clientPhone ? `<p><strong>📞</strong> ${clientPhone}</p>` : ''}
            <p><strong>🎯</strong> ${type}</p>
            <p><strong>📅</strong> ${formatDate(start)}</p>
            <p><strong>📍</strong> ${location}</p>
            ${notes ? `<p><strong>📝</strong> ${notes}</p>` : ''}
          </div>
        </div>
      </div>`,
  })
}

async function sendContactNotification({ nom, email, telephone, message }) {
  await resend.emails.send({
    from:    FROM,
    to:      SOPHRO,
    replyTo: email,
    subject: `✉️ Nouveau message de ${nom}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;color:#3a3330">
        <div style="background:#f5f2ef;padding:32px;border-radius:16px">
          <h2 style="color:#f0806b">Nouveau message via le site</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> <a href="mailto:${email}" style="color:#f0806b">${email}</a></p>
          ${telephone ? `<p><strong>Tél :</strong> ${telephone}</p>` : ''}
          <div style="background:white;padding:16px;border-radius:8px;margin-top:16px">${message}</div>
        </div>
      </div>`,
  })
}

async function sendContactConfirmation({ nom, email }) {
  await resend.emails.send({
    from:    FROM,
    to:      email,
    replyTo: SOPHRO,
    subject: 'Votre message a bien été reçu',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;color:#3a3330">
        <div style="background:#f5f2ef;padding:40px;border-radius:16px">
          <h2 style="color:#f0806b">Merci pour votre message !</h2>
          <p>Bonjour ${nom},</p>
          <p>Votre message a bien été reçu. Laetitia vous répondra dans les meilleurs délais.</p>
          <p style="color:#888;font-size:13px;margin-top:24px">${NAME}<br>Sophrologue &amp; Coach certifiée EMCC</p>
        </div>
      </div>`,
  })
}

async function sendEntrepriseNotification({ societe, contact, email, telephone, effectif, besoin, format, message }) {
  await resend.emails.send({
    from:    FROM,
    to:      SOPHRO,
    replyTo: email,
    subject: `🏢 Demande devis entreprise – ${societe}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;color:#3a3330">
        <div style="background:#f5f2ef;padding:32px;border-radius:16px">
          <h2 style="color:#f0806b">Nouvelle demande entreprise</h2>
          <table style="width:100%;font-size:14px">
            <tr><td style="color:#888;padding:4px 0;width:140px">Société</td><td><strong>${societe}</strong></td></tr>
            <tr><td style="color:#888;padding:4px 0">Contact</td><td>${contact}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Email</td><td><a href="mailto:${email}" style="color:#f0806b">${email}</a></td></tr>
            ${telephone ? `<tr><td style="color:#888;padding:4px 0">Téléphone</td><td>${telephone}</td></tr>` : ''}
            <tr><td style="color:#888;padding:4px 0">Effectif</td><td>${effectif || '–'}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Intervention</td><td>${besoin || '–'}</td></tr>
            <tr><td style="color:#888;padding:4px 0">Format</td><td>${format || '–'}</td></tr>
          </table>
          ${message ? `<div style="margin-top:16px;background:white;padding:16px;border-radius:8px;font-size:14px">${message}</div>` : ''}
        </div>
      </div>`,
  })
}

async function sendEntrepriseConfirmation({ contact, societe, email }) {
  await resend.emails.send({
    from:    FROM,
    to:      email,
    replyTo: SOPHRO,
    subject: 'Votre demande de devis a bien été reçue',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;color:#3a3330">
        <div style="background:#f5f2ef;padding:40px;border-radius:16px">
          <h2 style="color:#f0806b">Merci pour votre demande !</h2>
          <p>Bonjour ${contact},</p>
          <p>Votre demande pour <strong>${societe}</strong> a bien été reçue. Laetitia vous recontactera sous <strong>48h</strong>.</p>
          <p style="color:#888;font-size:13px;margin-top:24px">${NAME}<br>Sophrologue &amp; Coach certifiée EMCC</p>
        </div>
      </div>`,
  })
}

module.exports = {
  sendConfirmationToClient, sendNotificationToSophro,
  sendContactNotification,  sendContactConfirmation,
  sendEntrepriseNotification, sendEntrepriseConfirmation,
}
