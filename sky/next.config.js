/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Banking_app/sky',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
