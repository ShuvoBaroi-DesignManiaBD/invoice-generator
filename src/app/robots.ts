import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `${process.env.BASE_URL || 'https://invoice-generator.vercel.app'}/sitemap.xml`,
  }
}
