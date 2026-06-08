'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { label: 'Accueil',  href: '/#accueil' },
  { label: 'Vision',   href: '/#vision' },
  {
    label: 'Méthodes',
    href: '/#methodes',
    children: [
      { label: 'Coaching',    href: '/#coaching' },
      { label: 'Sophrologie', href: '/#sophrologie' },
    ],
  },
  { label: 'Qui ?',        href: '/#qui' },
  { label: 'Entreprises', href: '/entreprises' },
  { label: 'Contact',     href: '/#contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mobileMethodesOpen, setMobileMethodesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-blanc-casse/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container-max flex items-center justify-between h-20 px-6 md:px-12">
        {/* Logo */}
        <Link href="/#accueil" className="flex items-center">
          <Image
            src="/logos/LOGO ROSE SAUMON.png"
            alt="P.ose – Sophrologie & Coaching"
            width={120}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-texte">
          {navLinks.map((link) =>
            link.children ? (
              /* Dropdown — CSS group hover, pas de JS timing */
              <li key={link.label} className="relative group">
                <a
                  href={link.href}
                  className="flex items-center gap-1 hover:text-rose-saumon transition-colors py-2"
                >
                  {link.label}
                  <svg className="w-3 h-3 mt-0.5 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </a>
                {/* Le dropdown reste ouvert tant que la souris est sur le groupe */}
                <ul className="absolute left-0 top-full min-w-[180px] bg-blanc-casse rounded-xl shadow-lg py-2
                               opacity-0 invisible translate-y-2
                               group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                               transition-all duration-200">
                  {link.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        className="block px-4 py-2.5 text-texte hover:bg-rose-pastel/20 hover:text-rose-saumon transition-colors"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.label}>
                <a href={link.href} className="hover:text-rose-saumon transition-colors">
                  {link.label}
                </a>
              </li>
            )
          )}

          {/* CTA */}
          <li>
            <Link href="/rdv" className="btn-primary">
              Prendre RDV
            </Link>
          </li>
        </ul>

        {/* Burger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blanc-casse border-t border-rose-pastel/30 px-6 py-6 flex flex-col gap-1 text-sm font-medium text-texte">
          {navLinks.map((link) => (
            <div key={link.label}>
              <div className="flex items-center justify-between">
                <a
                  href={link.href}
                  className="block hover:text-rose-saumon transition-colors py-2 flex-1"
                  onClick={() => { if (!link.children) setMenuOpen(false) }}
                >
                  {link.label}
                </a>
                {link.children && (
                  <button
                    onClick={() => setMobileMethodesOpen(!mobileMethodesOpen)}
                    className="p-2 text-texte/50"
                    aria-label="Ouvrir sous-menu"
                  >
                    <svg className={`w-4 h-4 transition-transform ${mobileMethodesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {link.children && mobileMethodesOpen && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {link.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block text-rose-saumon/80 hover:text-rose-saumon transition-colors py-1.5 text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/rdv" className="btn-primary text-center mt-3" onClick={() => setMenuOpen(false)}>
            Prendre RDV
          </Link>
        </div>
      )}
    </header>
  )
}
