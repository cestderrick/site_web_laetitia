'use client'

import { useState, useEffect } from 'react'

type Review = {
  author: string
  photo:  string | null
  rating: number
  date:   string
  text:   string
}

function relativeDate(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 7)  return days <= 1 ? "il y a 1 jour" : `il y a ${days} jours`
    const weeks = Math.floor(days / 7)
    if (weeks < 5) return weeks <= 1 ? "il y a 1 semaine" : `il y a ${weeks} semaines`
    const months = Math.floor(days / 30)
    if (months < 12) return months <= 1 ? "il y a 1 mois" : `il y a ${months} mois`
    const years = Math.floor(days / 365)
    return years <= 1 ? "il y a 1 an" : `il y a ${years} ans`
  } catch { return iso }
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < n ? 'text-yellow-400' : 'text-texte/20'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ photo, name }: { photo: string | null; name: string }) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt={name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-rose-pastel/50 flex items-center justify-center flex-shrink-0 text-rose-saumon font-semibold text-sm">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function Avis() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating,  setRating]  = useState<number | null>(null)
  const [total,   setTotal]   = useState<number | null>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/reviews.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.reviews?.length) return
        setReviews(data.reviews)
        if (data.rating) setRating(data.rating)
        if (data.total)  setTotal(data.total)
      })
      .catch(() => {})
  }, [])

  if (reviews.length === 0) return null

  const count = reviews.length
  const prev  = () => setCurrent(c => (c - 1 + count) % count)
  const next  = () => setCurrent(c => (c + 1) % count)
  const visible = [
    (current - 1 + count) % count,
    current,
    (current + 1) % count,
  ]

  return (
    <section className="section-padding bg-rose-pastel/10 overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-rose-saumon text-xs font-semibold tracking-widest uppercase mb-3">Témoignages</p>
          <h2 className="text-4xl md:text-5xl text-texte mb-2">Ils témoignent</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Stars n={Math.round(rating ?? 5)} />
            <span className="text-texte/60 text-sm">{rating ?? 5}/5 · {total ?? count} avis</span>
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div className="w-16 h-0.5 bg-rose-saumon mx-auto mt-6" />
        </div>

        {/* Desktop : 3 cartes */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
          {visible.map((idx, pos) => {
            const a = reviews[idx]
            return (
              <div key={idx} onClick={() => setCurrent(idx)}
                className={`bg-blanc-casse rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  pos === 1 ? 'shadow-lg scale-[1.03] border border-rose-pastel/40' : 'opacity-60 hover:opacity-80 shadow-sm'
                }`}>
                <Stars n={a.rating} />
                <p className="text-texte/75 text-sm leading-relaxed mt-4 mb-5 italic line-clamp-5">"{a.text}"</p>
                <div className="flex items-center gap-2">
                  <Avatar photo={a.photo} name={a.author} />
                  <div>
                    <p className="font-semibold text-texte text-sm leading-none">{a.author}</p>
                    <p className="text-texte/40 text-xs mt-0.5">{a.date}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile : 1 carte */}
        <div className="md:hidden mb-8">
          <div className="bg-blanc-casse rounded-2xl p-6 shadow-md border border-rose-pastel/30">
            <Stars n={reviews[current].rating} />
            <p className="text-texte/75 text-sm leading-relaxed mt-4 mb-5 italic">"{reviews[current].text}"</p>
            <div className="flex items-center gap-2">
              <Avatar photo={reviews[current].photo} name={reviews[current].author} />
              <div>
                <p className="font-semibold text-texte text-sm leading-none">{reviews[current].author}</p>
                <p className="text-texte/40 text-xs mt-0.5">{reviews[current].date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} aria-label="Précédent"
            className="w-10 h-10 rounded-full border border-rose-pastel/40 flex items-center justify-center hover:border-rose-saumon hover:text-rose-saumon transition-colors text-texte/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-rose-saumon' : 'w-2 h-2 bg-rose-pastel/50'}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Suivant"
            className="w-10 h-10 rounded-full border border-rose-pastel/40 flex items-center justify-center hover:border-rose-saumon hover:text-rose-saumon transition-colors text-texte/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-texte/40">
          <a href="https://g.page/r/ChIJR2xafuDr9EcRRioXLswDybg/review" target="_blank" rel="noopener noreferrer"
            className="hover:text-rose-saumon transition-colors underline underline-offset-2">
            Voir tous les avis sur Google →
          </a>
        </p>
      </div>
    </section>
  )
}
