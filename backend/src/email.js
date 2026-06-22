const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM    = `P.ose Sophrologie <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`
const SOPHRO  = process.env.SOPHRO_EMAIL
const NAME    = process.env.SOPHRO_NAME

// "2024-06-15T18:00:00" → "20240615T180000" (format Google Calendar)
function toGCalDate(isoString) {
  return isoString.replace(/[-:]/g, '').substring(0, 15)
}

function buildGCalLink({ start, end, title, location, description }) {
  const base   = 'https://calendar.google.com/calendar/render'
  const params = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(title)}`,
    `dates=${toGCalDate(start)}%2F${toGCalDate(end)}`,
    `ctz=Europe%2FParis`,
    `location=${encodeURIComponent(location || '')}`,
    `details=${encodeURIComponent(description || '')}`,
  ].join('&')
  return `${base}?${params}`
}

function formatDate(isoString) {
  // isoString est déjà en heure Paris (ex: "2024-06-15T18:00:00")
  // On parse manuellement pour éviter toute conversion UTC → Paris côté serveur
  const [datePart, timePart] = isoString.split('T')
  const [year, month, day]   = datePart.split('-').map(Number)
  const time = timePart ? timePart.substring(0, 5) : '00:00' // "18:00"

  // Utiliser Date() avec composants locaux pour avoir le bon jour de semaine
  const d = new Date(year, month - 1, day)
  const WEEKDAYS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
  const MONTHS   = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

  return `${WEEKDAYS[d.getDay()]} ${day} ${MONTHS[month - 1]} ${year} à ${time}`
}

async function sendConfirmationToClient({ clientName, clientEmail, type, location, start, end, meetLink, sessionType }) {
  const gCalLink = buildGCalLink({
    start,
    end,
    title:       `RDV ${NAME} – ${type}`,
    location,
    description: `Rendez-vous avec ${NAME}, Sophrologue & Coach à Lyon.`,
  })

  const meetBlock = meetLink
    ? `<div style="background:#e8f0fe;border-radius:12px;padding:20px;margin:16px 0;border-left:4px solid #4285f4">
         <p style="margin:0"><strong>🎥 Lien Google Meet :</strong></p>
         <a href="${meetLink}" style="color:#4285f4;font-size:15px;word-break:break-all">${meetLink}</a>
         <p style="margin:8px 0 0;font-size:13px;color:#555">Cliquez sur ce lien le jour du rendez-vous pour rejoindre la séance.</p>
       </div>`
    : ''

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
          <p>Votre séance <strong>${type}</strong>${sessionType ? ` · <strong>${sessionType}</strong>` : ''} a bien été enregistrée.</p>
          <div style="background:white;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #f0806b">
            <p style="margin:0"><strong>📅 Date :</strong> ${formatDate(start)}</p>
            <p style="margin:8px 0 0"><strong>📍 Lieu :</strong> ${location}</p>
          </div>
          ${meetBlock}
          <div style="text-align:center;margin:24px 0">
            <a href="${gCalLink}" target="_blank"
               style="display:inline-block;background:#f0806b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold">
              📆 Ajouter à mon Google Agenda
            </a>
          </div>
          <p>En cas d'empêchement, merci de prévenir <strong>au moins 48h à l'avance</strong> :</p>
          <p>📧 <a href="mailto:${SOPHRO}" style="color:#f0806b">${SOPHRO}</a></p>
          <p style="color:#888;font-size:14px;margin-top:32px">À très bientôt,<br><strong style="color:#3a3330">${NAME}</strong><br>Sophrologue &amp; Coach certifiée EMCC</p>
        </div>
      </div>`,
  })
}

async function sendNotificationToSophro({ clientName, clientEmail, clientPhone, type, location, start, notes, meetLink, sessionType, isFirstContact }) {
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
            ${sessionType ? `<p><strong>📋 Séance :</strong> ${sessionType}</p>` : ''}
            <p><strong>🎯 Mode :</strong> ${type}</p>
            <p><strong>📅</strong> ${formatDate(start)}</p>
            <p><strong>📍</strong> ${location}</p>
            ${meetLink ? `<p><strong>🎥 Meet :</strong> <a href="${meetLink}" style="color:#4285f4">${meetLink}</a></p>` : ''}
            ${isFirstContact ? `<p><strong>🆕 Première prise de contact</strong> — appeler avant la séance</p>` : ''}
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
