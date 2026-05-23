/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lms/ui', '@lms/utils', '@lms/shared-types'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async rewrites() {
    const apiUrl = process.env.API_INTERNAL_URL || 'http://localhost:4000';
    const prefix = process.env.API_PREFIX || '/api/v1';

    return [
      {
        source: `${prefix}/:path*`,
        destination: `${apiUrl}${prefix}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
