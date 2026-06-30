import { LocaleProvider } from '@/context/LocaleContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Sophrologist & Coach in Lyon – Laetitia Chastel | P.ose',
    template: '%s | P.ose – Sophrologist & Coach Lyon',
  },
  description: 'Laetitia Chastel, certified sophrologist and EMCC coach in Lyon (Bellecour) and online. Stress management, life transitions, self-confidence. Caycedian sophrology.',
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider locale="en">
      {children}
    </LocaleProvider>
  )
}
