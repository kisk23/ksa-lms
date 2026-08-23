import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface SitemapCourse {
  id: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/courses`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/teachers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    // Generate URLs for all published courses
    const res = await fetch(`${API_URL}/courses?limit=200&status=PUBLISHED`, {
      next: { revalidate: 3600 }, // refresh the sitemap at most hourly
    });
    if (!res.ok) throw new Error('failed');

    const payload = await res.json();
    const courses: SitemapCourse[] = Array.isArray(payload?.data) ? payload.data : [];

    const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
      url: `${SITE_URL}/courses/${course.id}`,
      lastModified: course.updatedAt ? new Date(course.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...courseRoutes];
  } catch {
    // If the API is unreachable, still return the static public pages
    return staticRoutes;
  }
}
