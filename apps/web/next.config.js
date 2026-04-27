/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lms/ui', '@lms/utils', '@lms/shared-types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
