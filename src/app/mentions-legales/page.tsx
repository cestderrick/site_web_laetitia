import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mentions légales – P.ose Sophrologie & Coaching Lyon',
  robots: { index: false },
}

export default function MentionsLegales() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blanc-casse pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto prose prose-stone">
          <h1>Mentions légales</h1>

          <h2>Éditeur du site</h2>
          <p>
            Le site P.ose est édité par :<br />
            <strong>Laetitia Chastel</strong><br />
            Sophrologue &amp; Coach certifiée<br />
            Micro-entrepreneure<br />
            29 place Bellecour, 69002 Lyon<br />
            Email : <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a><br />
            Téléphone : 06 64 43 87 47<br />
            SIRET : 90936727800027
          </p>
          <p><strong>Directrice de la publication :</strong> Laetitia Chastel</p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par :<br />
            <strong>Render</strong> (Render Services, Inc.)<br />
            651 N Broad St, Suite 206, Middletown, DE 19709, États-Unis<br />
            <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos, structure, charte graphique),
            sauf mention contraire, est la propriété exclusive de Laetitia Chastel. Toute reproduction,
            représentation, modification, adaptation ou diffusion, totale ou partielle, de ce contenu,
            par quelque moyen que ce soit, est interdite sans l&apos;autorisation préalable et écrite
            de Laetitia Chastel.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les informations présentes sur ce site sont fournies à titre informatif. La sophrologie et
            le coaching proposés par Laetitia Chastel ne constituent ni un acte médical, ni un acte de
            soins, et ne se substituent en aucun cas à un suivi médical ou psychologique. L&apos;utilisateur
            demeure seul responsable de l&apos;utilisation des informations communiquées sur le site.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les formulaires de contact et de demande de rendez-vous permettent de transmettre les
            informations que vous renseignez (nom, adresse e-mail, numéro de téléphone, message…)
            par e-mail à Laetitia Chastel, afin de :
          </p>
          <ul>
            <li>répondre à vos demandes,</li>
            <li>organiser des rendez-vous,</li>
            <li>établir un devis pour les prestations aux entreprises.</li>
          </ul>
          <p>
            Ces données ne sont pas stockées dans une base de données du site. Elles sont simplement
            transmises par e-mail à Laetitia Chastel et, le cas échéant, à la personne qui a rempli
            le formulaire (copie de confirmation).
          </p>
          <p>
            Conformément au Règlement général sur la protection des données (RGPD) et à la loi
            « Informatique et Libertés » modifiée, vous disposez des droits suivants sur vos données
            personnelles :
          </p>
          <ul>
            <li>droit d&apos;accès,</li>
            <li>droit de rectification,</li>
            <li>droit d&apos;effacement,</li>
            <li>droit à la limitation du traitement,</li>
            <li>droit d&apos;opposition,</li>
            <li>droit à la portabilité lorsque cela s&apos;applique.</li>
          </ul>
          <p>
            Vous pouvez exercer ces droits en écrivant à :{' '}
            <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a>.
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la CNIL
            ({' '}<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>)
            si vous estimez que vos droits ne sont pas respectés.
          </p>
          <p>
            Pour plus d&apos;informations sur le traitement de vos données, veuillez consulter
            notre <a href="/politique-confidentialite">Politique de confidentialité</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site utilise des cookies strictement nécessaires à son fonctionnement et, sous réserve
            de votre consentement, des cookies analytiques/mesure d&apos;audience. Pour en savoir plus
            sur l&apos;usage des cookies et paramétrer vos choix, veuillez consulter
            notre <a href="/politique-cookies">Politique de cookies</a>.
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
