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
          <p>
            Laetitia Chastel s'engage à protéger la vie privée des utilisateurs de ce site,
            en conformité avec le Règlement Général sur la Protection des Données (RGPD – UE 2016/679).
          </p>

          <h2>Données collectées</h2>
          <p>Nous collectons les données suivantes via le formulaire de contact :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (facultatif)</li>
            <li>Contenu du message</li>
          </ul>
          <p>
            Ces données sont utilisées uniquement pour répondre à votre demande et ne sont
            pas transmises à des tiers.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Vos données sont conservées pendant une durée maximale de 3 ans à compter
            de votre dernière interaction.
          </p>

          <h2>Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement ("droit à l'oubli")</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <p>
            Pour exercer ces droits : <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a>
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>

          <h2>Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles appropriées sont mises en place
            pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
