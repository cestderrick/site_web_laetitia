import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://site-web-laetitia.onrender.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:              SITE_URL,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         1,
    },
    {
      url:              `${SITE_URL}/entreprises`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.8,
    },
    {
      url:              `${SITE_URL}/rdv`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.9,
    },
  ]
}
