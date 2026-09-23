import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Seules les pages publiques (non protégées par l'auth) ont vocation à être
// indexées : /dashboard/* nécessite une session et n'apporte rien en SEO.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/auth/signin', '/auth/signup', '/confidentialite', '/cgu'];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
