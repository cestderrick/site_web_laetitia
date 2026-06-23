import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Politique de confidentialité – P.ose',
  robots: { index: false },
}

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blanc-casse pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto prose prose-stone">
          <h1>Politique de confidentialité</h1>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées via ce site est :<br />
            <strong>Laetitia Chastel</strong>, Sophrologue &amp; Coach certifiée<br />
            Email : <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a>
          </p>
          <p>
            Laetitia Chastel s&apos;engage à protéger la vie privée des utilisateurs du site,
            en conformité avec le Règlement Général sur la Protection des Données (RGPD – UE 2016/679)
            et la loi « Informatique et Libertés » modifiée.
          </p>

          <h2>2. Données collectées et finalités</h2>
          <p>Les données sont collectées exclusivement via les formulaires présents sur le site, pour les finalités suivantes :</p>

          <h3>a) Formulaire de contact (particuliers / entreprises)</h3>
          <p>Données collectées :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (facultatif)</li>
            <li>Contenu du message</li>
          </ul>
          <p>
            <strong>Finalité :</strong> répondre à votre demande (informations, prise de contact, questions diverses).<br />
            <strong>Base légale :</strong> votre consentement et/ou l&apos;intérêt légitime à répondre à vos sollicitations.
          </p>

          <h3>b) Formulaire de prise de rendez-vous</h3>
          <p>Données collectées :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (facultatif)</li>
            <li>Informations nécessaires à l&apos;organisation du rendez-vous (date, créneau, type de séance, présentiel/visio, etc.)</li>
          </ul>
          <p>
            <strong>Finalité :</strong> organiser et gérer vos rendez-vous (création de l&apos;événement dans Google Agenda,
            envoi d&apos;un lien de visioconférence si nécessaire, échanges avant/après séance).<br />
            <strong>Base légale :</strong> exécution de mesures précontractuelles et, le cas échéant, exécution du contrat de prestation.
          </p>

          <h3>c) Formulaire de demande de devis (entreprises)</h3>
          <p>Données collectées :</p>
          <ul>
            <li>Nom et prénom du contact</li>
            <li>Nom de l&apos;entreprise</li>
            <li>Adresse e-mail professionnelle</li>
            <li>Numéro de téléphone (facultatif)</li>
            <li>Contenu de la demande / besoins exprimés</li>
          </ul>
          <p>
            <strong>Finalité :</strong> établir et envoyer un devis, puis assurer le suivi commercial.<br />
            <strong>Base légale :</strong> exécution de mesures précontractuelles et intérêt légitime (prospection B2B raisonnable).
          </p>

          <h2>3. Modalités de collecte et absence de stockage en base de données</h2>
          <p>Les informations que vous renseignez dans les formulaires :</p>
          <ul>
            <li>sont transmises par e-mail à Laetitia Chastel (et, le cas échéant, une copie de confirmation à l&apos;adresse que vous avez fournie),</li>
            <li>peuvent être intégrées automatiquement dans Google Agenda pour la création du rendez-vous, ainsi que dans un outil de visioconférence pour la génération d&apos;un lien de réunion.</li>
          </ul>
          <p>Aucune donnée personnelle n&apos;est stockée dans une base de données du site internet lui-même.</p>

          <h2>4. Durée de conservation des données</h2>
          <p>Les données sont conservées pendant la durée strictement nécessaire aux finalités poursuivies, notamment :</p>
          <ul>
            <li>les échanges par e-mail liés à une demande de contact ou de rendez-vous : jusqu&apos;à 3 ans après votre dernière interaction ;</li>
            <li>les données nécessaires à l&apos;émission de devis et au suivi de la relation commerciale : jusqu&apos;à 3 ans après le dernier contact pour la prospection, et plus longtemps si une relation contractuelle est nouée (en fonction des obligations légales, notamment comptables et fiscales).</li>
          </ul>
          <p>Les événements créés dans Google Agenda peuvent être conservés le temps nécessaire au suivi de la relation, puis supprimés ou archivés.</p>

          <h2>5. Destinataires des données</h2>
          <p>
            Vos données sont destinées uniquement à Laetitia Chastel. Elles ne sont pas vendues ni cédées à des tiers.
          </p>
          <p>Certains prestataires techniques peuvent néanmoins intervenir dans le cadre de l&apos;hébergement et des outils utilisés, notamment :</p>
          <ul>
            <li>l&apos;hébergeur du site,</li>
            <li>les services de Google (Gmail, Google Agenda).</li>
          </ul>
          <p>
            Ces prestataires agissent en qualité de sous-traitants ou de responsables conjoints du traitement,
            dans le respect de la réglementation applicable et des conditions de sécurité et de confidentialité appropriées.
          </p>

          <h2>6. Transferts de données hors de l&apos;Union européenne</h2>
          <p>
            Certains prestataires (notamment Google) peuvent traiter vos données depuis des pays situés en dehors
            de l&apos;Union européenne. Dans ce cas, tout est mis en œuvre pour que ces transferts soient encadrés
            par des garanties appropriées (clauses contractuelles types de la Commission européenne ou mécanismes
            équivalents), conformément au RGPD.
          </p>

          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD et à la loi « Informatique et Libertés » modifiée, vous disposez des droits suivants sur vos données personnelles :</p>
          <ul>
            <li>droit d&apos;accès à vos données,</li>
            <li>droit de rectification si elles sont inexactes ou incomplètes,</li>
            <li>droit à l&apos;effacement (« droit à l&apos;oubli »),</li>
            <li>droit à la limitation du traitement,</li>
            <li>droit d&apos;opposition,</li>
            <li>droit à la portabilité lorsque cela s&apos;applique.</li>
          </ul>
          <p>
            Pour exercer ces droits ou pour toute question relative au traitement de vos données :{' '}
            <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a>
          </p>
          <p>
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>{' '}
            si vous estimez que vos droits ne sont pas respectés.
          </p>

          <h2>8. Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour protéger vos données
            contre tout accès, modification, divulgation ou destruction non autorisés. Néanmoins, aucun système de
            transmission ou de stockage électronique n&apos;est totalement sécurisé ; Laetitia Chastel ne peut
            garantir une sécurité absolue, mais s&apos;engage à agir avec vigilance et à réagir en cas d&apos;incident
            de sécurité identifié.
          </p>

          <h2>9. Mise à jour de la politique de confidentialité</h2>
          <p>
            La présente politique de confidentialité peut être modifiée pour refléter les évolutions du site ou
            de la réglementation applicable.
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
