import { MetadataRoute } from 'next';
import { APP_BASE_URL } from '@/config/app.constants';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = APP_BASE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/superadmin/'], // Hide internal dashboards
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
