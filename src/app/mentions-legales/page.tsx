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
            <strong>Laetitia Chastel</strong><br />
            Sophrologue &amp; Coach certifiée<br />
            29 place Bellecour, 69002 Lyon<br />
            Email : sophrocoachinglaetitia@gmail.com<br />
            Téléphone : 06 64 43 87 47<br />
            SIRET : <em>[à compléter]</em>
          </p>

          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par <strong>Render</strong> (Render Services, Inc.)<br />
            651 N Broad St, Suite 206, Middletown, DE 19709, États-Unis<br />
            <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, structure) est la propriété
            exclusive de Laetitia Chastel, sauf mention contraire. Toute reproduction, même partielle,
            est interdite sans autorisation préalable.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les informations fournies sur ce site sont données à titre informatif et ne constituent
            en aucun cas un avis médical ou thérapeutique. La sophrologie et le coaching ne se
            substituent pas à un suivi médical ou psychologique.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
            de vos données. Pour toute demande : sophrocoachinglaetitia@gmail.com
          </p>
          <p>
            Voir notre{' '}
            <a href="/politique-confidentialite">Politique de confidentialité</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site utilise des cookies techniques et, avec votre consentement, des cookies analytiques.
            Voir notre <a href="/politique-cookies">Politique de cookies</a>.
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
