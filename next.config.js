/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // static export → Render static site (pas de cold start)
  trailingSlash: true,
  images: {
    unoptimized: true,   // requis pour export statique
  },
}

module.exports = nextConfig
