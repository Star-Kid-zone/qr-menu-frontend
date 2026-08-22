import { MetadataRoute } from 'next';
import { APP_BASE_URL, getTenantPublicUrl } from '@/config/app.constants';
import { fetchPublicSitemapSlugs } from '@/services/public-site.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = APP_BASE_URL;

  const slugs = await fetchPublicSitemapSlugs();

  // Map slugs to sitemap entries
  const tenantEntries: MetadataRoute.Sitemap = slugs.map(({ slug, updatedAt }) => ({
    url: getTenantPublicUrl(slug), // Adjust this based on your subdomain/path strategy
    lastModified: new Date(updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Add static routes like main landing page, login, etc.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...tenantEntries];
}
