import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/courses', '/teachers', '/about'],
        disallow: ['/dashboard', '/checkout', '/api', '/login', '/register', '/verify-otp'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
