'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const r = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error()
      setSent(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-blanc-casse">
      <div className="container-max">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="text-4xl md:text-5xl text-texte mb-4">
            Vous avez envie d'être accompagné·e ?
          </h2>
          <p className="text-texte/60 text-lg max-w-xl mx-auto">
            Remplissez le formulaire et je reviendrai vers vous rapidement.
          </p>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div>
            {sent ? (
              <div className="bg-vert-pastel/20 border border-vert-pastel rounded-2xl p-8 text-center">
                <span className="text-4xl mb-4 block">✅</span>
                <h3 className="text-2xl text-texte mb-2">Message envoyé !</h3>
                <p className="text-texte/70">
                  Merci pour votre message. Je vous réponds dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1" htmlFor="nom">
                      Nom & Prénom *
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={form.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
                      placeholder="Marie Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1" htmlFor="telephone">
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={form.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
                      placeholder="06 xx xx xx xx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte"
                    placeholder="marie@exemple.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-pastel/40 bg-white focus:outline-none focus:border-rose-saumon transition-colors text-texte resize-none"
                    placeholder="Décrivez brièvement ce qui vous amène…"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">
                    Une erreur est survenue. Merci de réessayer ou d'écrire directement par mail.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {loading ? 'Envoi en cours…' : 'Envoyer mon message'}
                </button>
              </form>
            )}
          </div>

          {/* Coordonnées */}
          <div className="flex flex-col gap-8 justify-center">
            {[
              { icone: '📍', titre: 'Adresse',    valeur: '29 place Bellecour\n69002 Lyon' },
              { icone: '📧', titre: 'Email',      valeur: 'sophrocoachinglaetitia@gmail.com', href: 'mailto:sophrocoachinglaetitia@gmail.com' },
              { icone: '📞', titre: 'Téléphone',  valeur: '06 64 43 87 47', href: 'tel:+33664438747' },
            ].map(({ icone, titre, valeur, href }) => (
              <div key={titre} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-rose-pastel/20 flex items-center justify-center text-xl flex-shrink-0">
                  {icone}
                </div>
                <div>
                  <p className="text-xs font-semibold text-texte/50 uppercase tracking-wider mb-0.5">{titre}</p>
                  {href ? (
                    <a href={href} className="text-texte hover:text-rose-saumon transition-colors whitespace-pre-line">
                      {valeur}
                    </a>
                  ) : (
                    <p className="text-texte whitespace-pre-line">{valeur}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Réseaux sociaux */}
            <div className="flex gap-3 mt-2">
              <a
                href="https://www.instagram.com/laeti.sophrocoach/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-rose-saumon flex items-center justify-center text-white hover:bg-rose-saumon/80 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/laetitia-chastel/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-texte flex items-center justify-center text-white hover:bg-texte/80 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
