import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace with your actual production URL
  const baseUrl = 'https://gloyas.com';

  const coreRoutes = [
    '',
    '/about',
    '/careers',
    '/contact',
    '/process',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const serviceRoutes = [
    '/services/web-designing',
    '/services/branding',
    '/services/social-media-management',
    '/services/marketing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...coreRoutes, ...serviceRoutes];
}
