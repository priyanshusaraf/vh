import { readFileSync } from 'node:fs';

// [old path, new path] pairs for product URLs that were shortened or renamed.
const urlRedirects = JSON.parse(
  readFileSync(new URL('./data/url-redirects.json', import.meta.url), 'utf8'),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Return to the same spot in the catalogue after viewing a product.
  experimental: { scrollRestoration: true },
  async redirects() {
    return urlRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants at the edge for 31 days.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
