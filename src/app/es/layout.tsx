import { LocaleProvider } from '@/context/LocaleContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Sofróloga & Coach en Lyon – Laetitia Chastel | P.ose',
    template: '%s | P.ose – Sofróloga & Coach Lyon',
  },
  description: 'Laetitia Chastel, sofróloga certificada y coach EMCC en Lyon (Bellecour) y en línea. Gestión del estrés, transiciones de vida, confianza en uno mismo. Sofrología Caycediana.',
}

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider locale="es">
      {children}
    </LocaleProvider>
  )
}
