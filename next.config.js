/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/app/:rest*',
        destination: '/download',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
