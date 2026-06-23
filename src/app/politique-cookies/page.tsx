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

          <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette,
            smartphone) lorsque vous consultez un site internet.
          </p>
          <p>
            Il permet notamment au site de mémoriser certaines informations relatives à votre
            navigation (par exemple votre choix de consentement aux cookies).
          </p>

          <h2>2. Cookies utilisés sur ce site</h2>
          <p>
            Ce site utilise uniquement des cookies nécessaires à son fonctionnement et, avec votre
            accord, des cookies de mesure d&apos;audience anonymisée.
          </p>
          <p>Aucun cookie publicitaire ou de ciblage n&apos;est utilisé.</p>

          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Finalité</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>cookie-consent</code></td>
                <td>Cookie technique</td>
                <td>Mémoriser votre choix concernant l&apos;acceptation ou le refus des cookies non essentiels</td>
                <td>1 an</td>
              </tr>
              <tr>
                <td>Cookies analytiques</td>
                <td>Cookie analytique (soumis à votre consentement)</td>
                <td>
                  Mesure d&apos;audience et statistiques de fréquentation du site, de manière
                  anonymisée (pages consultées, durée de visite, etc.) afin d&apos;améliorer
                  le contenu
                </td>
                <td>13 mois</td>
              </tr>
            </tbody>
          </table>

          <p>
            Les cookies analytiques ne sont déposés qu&apos;après votre accord explicite via le
            bandeau de consentement.
          </p>

          <h2>3. Gestion de vos préférences</h2>
          <p>
            Lors de votre première visite sur le site, un bandeau vous informe de la présence de
            cookies et vous permet :
          </p>
          <ul>
            <li>d&apos;accepter tous les cookies,</li>
            <li>de refuser les cookies analytiques,</li>
            <li>ou de les paramétrer si une telle option est proposée.</li>
          </ul>
          <p>
            Vous pouvez à tout moment revenir sur vos choix en supprimant les cookies via les
            paramètres de votre navigateur (Chrome, Firefox, Safari, Edge, etc.).
          </p>
          <p>
            La désactivation des cookies techniques nécessaires peut toutefois altérer le bon
            fonctionnement du site.
          </p>

          <h2>4. Contact</h2>
          <p>
            Pour toute question relative aux cookies ou à la protection de vos données
            personnelles, vous pouvez contacter :{' '}
            <a href="mailto:sophrocoachinglaetitia@gmail.com">
              sophrocoachinglaetitia@gmail.com
            </a>
          </p>

          <p className="text-sm text-texte/50 mt-8">Dernière mise à jour : juin 2025</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
