/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now available by default in Next.js 14.0.3
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }
}

module.exports = nextConfig