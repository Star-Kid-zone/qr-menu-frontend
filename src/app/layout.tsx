import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, Newsreader, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { APP_BASE_URL } from "@/config/app.constants";
import { APP_NAME, DEFAULT_APP_DESCRIPTION } from "@/constants/app.constants";
import { BRAND_ASSETS, BRAND_OG_IMAGE } from "@/constants/brand.constants";
import { THEME_BOOT_SCRIPT } from "@/constants/storage.constants";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

// App fonts other than the body face are not preloaded: tenant guest sites load their own fonts
// (site-system SiteFonts), so preloading these would compete with the guest hero for bandwidth.
// They still load on any page whose CSS uses them (admin, marketing, QR studio).
const fraunces = Fraunces({
  preload: false,
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const newsreader = Newsreader({
  preload: false,
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const outfit = Outfit({
  preload: false,
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  preload: false,
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const DEFAULT_DESCRIPTION = DEFAULT_APP_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: APP_NAME,
  // Set here (not as app/icon.* or app/opengraph-image.* files) so restaurant
  // guest sites can replace them with their own in buildTenantMetadata.
  icons: {
    icon: [
      { url: BRAND_ASSETS.favicon, sizes: "48x48" },
      { url: BRAND_ASSETS.iconSvg, type: "image/svg+xml" },
    ],
    apple: BRAND_ASSETS.appleTouchIcon,
  },
  manifest: BRAND_ASSETS.manifest,
  appleWebApp: { title: APP_NAME },
  openGraph: {
    title: APP_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: APP_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: BRAND_ASSETS.ogImage, ...BRAND_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [BRAND_ASSETS.ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b1d4f" },
    { media: "(prefers-color-scheme: dark)", color: "#24102f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${fraunces.variable} ${newsreader.variable} ${outfit.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
