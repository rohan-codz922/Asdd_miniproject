/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal standalone server bundle for Docker (copies only needed files)
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
