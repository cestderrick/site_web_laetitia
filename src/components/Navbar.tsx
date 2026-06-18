'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useContent, cs } from '@/hooks/useContent'

// Labels par défaut — écrasés si présents dans le Sheet
const ND = {
  lien_accueil:     'Accueil',
  lien_qui_suis_je: 'Qui suis-je ?',
  lien_vision:      'Vision',
  lien_methodes:    'Méthodes',
  lien_coaching:    'Coaching',
  lien_sophrologie: 'Sophrologie',
  lien_qui:         'Pour qui ?',
  lien_entreprises: 'Entreprises',
  lien_contact:     'Contact',
  cta_label:        'Prendre RDV',
}

function IconInstagram() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled,           setScrolled]           = useState(false)
  const [menuOpen,           setMenuOpen]           = useState(false)
  const [mobileMethodesOpen, setMobileMethodesOpen] = useState(false)
  const content = useContent()

  const instagram = cs(content, 'contact', 'instagram', 'https://www.instagram.com/laeti.sophrocoach/')
  const linkedin  = cs(content, 'contact', 'linkedin',  'https://www.linkedin.com/in/laetitia-chastel/')

  // Labels du menu — lus depuis le Sheet avec fallback sur les defaults
  const l = (key: keyof typeof ND) => cs(content, 'navbar', key, ND[key])

  const navLinks = [
    { label: l('lien_accueil'),     href: '/#accueil' },
    { label: l('lien_qui_suis_je'), href: '/#qui-suis-je' },
    { label: l('lien_vision'),      href: '/#vision' },
    {
      label: l('lien_methodes'),
      href: '/#methodes',
      children: [
        { label: l('lien_coaching'),    href: '/#coaching' },
        { label: l('lien_sophrologie'), href: '/#sophrologie' },
      ],
    },
    { label: l('lien_qui'),         href: '/#qui' },
    { label: l('lien_entreprises'), href: '/entreprises' },
    { label: l('lien_contact'),     href: '/#contact' },
  ]

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
          <Image src="/logos/LOGO ROSE SAUMON.png" alt="P.ose – Sophrologie & Coaching"
            width={120} height={48} className="object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-texte">
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.href} className="relative group">
                <a href={link.href} className="flex items-center gap-1 hover:text-rose-saumon transition-colors py-2">
                  {link.label}
                  <svg className="w-3 h-3 mt-0.5 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </a>
                <ul className="absolute left-0 top-full min-w-[180px] bg-blanc-casse rounded-xl shadow-lg py-2
                               opacity-0 invisible translate-y-2
                               group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                               transition-all duration-200">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <a href={child.href} className="block px-4 py-2.5 text-texte hover:bg-rose-pastel/20 hover:text-rose-saumon transition-colors">
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.href}>
                <a href={link.href} className="hover:text-rose-saumon transition-colors">{link.label}</a>
              </li>
            )
          )}

          {/* Réseaux sociaux */}
          <li className="flex items-center gap-2 border-l border-texte/10 pl-4">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full flex items-center justify-center text-texte/50 hover:text-rose-saumon hover:bg-rose-pastel/20 transition-colors">
                <IconInstagram />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-8 h-8 rounded-full flex items-center justify-center text-texte/50 hover:text-rose-saumon hover:bg-rose-pastel/20 transition-colors">
                <IconLinkedIn />
              </a>
            )}
          </li>

          {/* CTA */}
          <li>
            <Link href="/rdv" className="btn-primary">{l('cta_label')}</Link>
          </li>
        </ul>

        {/* Burger mobile */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-texte transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blanc-casse border-t border-rose-pastel/30 px-6 py-6 flex flex-col gap-1 text-sm font-medium text-texte">
          {navLinks.map((link) => (
            <div key={link.href}>
              <div className="flex items-center justify-between">
                <a href={link.href} className="block hover:text-rose-saumon transition-colors py-2 flex-1"
                  onClick={() => { if (!link.children) setMenuOpen(false) }}>
                  {link.label}
                </a>
                {link.children && (
                  <button onClick={() => setMobileMethodesOpen(!mobileMethodesOpen)} className="p-2 text-texte/50" aria-label="Ouvrir sous-menu">
                    <svg className={`w-4 h-4 transition-transform ${mobileMethodesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {link.children && mobileMethodesOpen && (
                <div className="pl-4 flex flex-col gap-0.5 mb-1">
                  {link.children.map((child) => (
                    <a key={child.href} href={child.href}
                      className="block text-rose-saumon/80 hover:text-rose-saumon transition-colors py-1.5 text-sm"
                      onClick={() => setMenuOpen(false)}>
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Réseaux sociaux mobile */}
          <div className="flex gap-3 pt-3 border-t border-rose-pastel/20 mt-2">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-rose-pastel/40 flex items-center justify-center text-texte/50 hover:text-rose-saumon hover:border-rose-saumon transition-colors">
                <IconInstagram />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-rose-pastel/40 flex items-center justify-center text-texte/50 hover:text-rose-saumon hover:border-rose-saumon transition-colors">
                <IconLinkedIn />
              </a>
            )}
          </div>

          <Link href="/rdv" className="btn-primary text-center mt-3" onClick={() => setMenuOpen(false)}>
            {l('cta_label')}
          </Link>
        </div>
      )}
    </header>
  )
}
