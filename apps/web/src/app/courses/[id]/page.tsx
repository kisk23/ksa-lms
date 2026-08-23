import type { Metadata } from 'next';

import CourseDetailClient from '@/features/courseDetails/CourseDetailClient';

interface PageProps {
  params: { id: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Fetches the course from the API; returns null on any failure. */
async function fetchCourse(id: string) {
  try {
    const res = await fetch(`${API_URL}/courses/${id}`, {
      next: { revalidate: 60 }, // ISR: re-fetch at most every 60 s
    });
    if (!res.ok) throw new Error('not found');
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * generateMetadata runs on the server and sets the <title>, description,
 * Open Graph, Twitter card and canonical URL from the live API response
 * before the page is sent to the browser.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await fetchCourse(params.id);

  if (!course) {
    return {
      title: 'تفاصيل الدورة | سُلَّم',
      description: 'استعرض تفاصيل الدورة التعليمية على منصة سُلَّم',
      alternates: { canonical: `/courses/${params.id}` },
    };
  }

  const title = `${course.title} | سُلَّم`;
  const description = course.description ?? `دورة ${course.title} على منصة سُلَّم التعليمية`;
  const url = `/courses/${params.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ar_SA',
      siteName: 'سُلَّم التعليمية',
      images: course.thumbnailUrl
        ? [{ url: course.thumbnailUrl, alt: course.title }]
        : [{ url: '/Sullam.svg', alt: 'شعار منصة سُلَّم التعليمية' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: course.thumbnailUrl ? [course.thumbnailUrl] : ['/Sullam.svg'],
    },
  };
}

/**
 * Builds schema.org JSON-LD structured data (Course + BreadcrumbList +
 * Organization) so search engines can render rich snippets.
 */
function buildJsonLd(course: Record<string, unknown>) {
  const chapters = Array.isArray(course.chapters) ? course.chapters : [];
  const teacher = course.teacher as { name?: string } | undefined;

  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description:
      (course.description as string) ?? `دورة ${course.title} على منصة سُلَّم التعليمية`,
    url: `${SITE_URL}/courses/${course.id}`,
    inLanguage: 'ar',
    provider: {
      '@type': 'Organization',
      name: 'منصة سُلَّم التعليمية',
      sameAs: SITE_URL,
    },
    instructor: teacher?.name ? { '@type': 'Person', name: teacher.name } : undefined,
    ...(typeof course.price === 'string' || typeof course.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: Number(course.price),
            priceCurrency: (course.currency as string) ?? 'SAR',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
    },
    numberOfCredits: chapters.length,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'الدورات', item: `${SITE_URL}/courses` },
      {
        '@type': 'ListItem',
        position: 3,
        name: course.title,
        item: `${SITE_URL}/courses/${course.id}`,
      },
    ],
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'منصة سُلَّم التعليمية',
    url: SITE_URL,
    logo: `${SITE_URL}/Sullam.svg`,
  };

  return [courseLd, breadcrumbLd, organizationLd];
}

/**
 * Page is a thin server component.
 * All data-fetching and interactivity live inside CourseDetailClient ('use client').
 */
export default async function CourseDetailPage({ params }: PageProps) {
  const course = await fetchCourse(params.id);

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-6 py-12"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      dir="rtl"
    >
      {course && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(course)).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <CourseDetailClient id={params.id} />
    </div>
  );
}
