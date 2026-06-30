import Navbar               from '@/components/Navbar'
import Footer               from '@/components/Footer'
import GoogleCalendarBooking from '@/components/GoogleCalendarBooking'

export default function RdvEN() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blanc-casse pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
              Book an appointment
            </p>
            <h1 className="text-4xl md:text-5xl text-texte mb-4">Choose your time slot</h1>
            <p className="text-texte/60 text-lg max-w-xl mx-auto leading-relaxed">
              Select an available slot below. You will receive a confirmation email after booking.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { titre: 'Coaching Session', duree: '60 min', desc: "A space to move from intention to action. Transition, decision, self-confidence.", couleur: 'border-rose-saumon/40 bg-rose-saumon/5' },
              { titre: 'Sophrology Session', duree: '60 min', desc: 'Breathing, movement and positive imagery to find calm and inner resources.', couleur: 'border-vert-pastel/50 bg-vert-pastel/10' },
            ].map(({ titre, duree, desc, couleur }) => (
              <div key={titre} className={`rounded-2xl border ${couleur} p-6`}>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl text-texte">{titre}</h2>
                  <span className="bg-blanc-casse text-texte/60 text-xs px-3 py-1 rounded-full">{duree}</span>
                </div>
                <p className="text-texte/65 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl border border-rose-pastel/30 shadow-sm p-8">
            <GoogleCalendarBooking />
          </div>
          <p className="text-center text-xs text-texte/40 mt-8">
            📍 In-person at 29 place Bellecour, 69002 Lyon · and online (video call)
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
