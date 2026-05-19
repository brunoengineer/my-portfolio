const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
  basePath,
  assetPrefix: basePath || undefined,
};

module.exports = nextConfig;
