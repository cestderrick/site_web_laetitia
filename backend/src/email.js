const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

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
  await resend.emails.send({
    from: `P.ose Sophrologie <${process.env.FROM_EMAIL}>`,
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
  await resend.emails.send({
    from: `P.ose – Nouveau RDV <${process.env.FROM_EMAIL}>`,
    to:   process.env.SOPHRO_EMAIL,
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

module.exports = { sendConfirmationToClient, sendNotificationToSophro }
