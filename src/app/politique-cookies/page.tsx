import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Politique de cookies – P.ose',
  robots: { index: false },
}

export default function PolitiqueCookies() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blanc-casse pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto prose prose-stone">
          <h1>Politique de cookies</h1>

          <h2>Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette,
            smartphone) lors de la visite d'un site web. Il permet de mémoriser des informations
            relatives à votre navigation.
          </p>

          <h2>Cookies utilisés sur ce site</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>cookie-consent</code></td>
                <td>Technique</td>
                <td>Mémoriser votre choix de consentement</td>
                <td>1 an</td>
              </tr>
              <tr>
                <td>Cookies analytiques</td>
                <td>Analytique (avec consentement)</td>
                <td>Mesure d'audience anonymisée</td>
                <td>13 mois</td>
              </tr>
            </tbody>
          </table>

          <h2>Gestion de vos préférences</h2>
          <p>
            Vous pouvez accepter ou refuser les cookies non essentiels lors de votre première
            visite via le bandeau de consentement. Vous pouvez également modifier votre choix
            à tout moment en effaçant les cookies de votre navigateur.
          </p>
          <p>
            La désactivation des cookies techniques peut altérer le bon fonctionnement du site.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative aux cookies :{' '}
            <a href="mailto:sophrocoachinglaetitia@gmail.com">sophrocoachinglaetitia@gmail.com</a>
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
