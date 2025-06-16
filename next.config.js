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
  },
  // Increase API body size limit for image uploads
  api: {
    bodyParser: {
      sizeLimit: '3mb',
    },
    responseLimit: false,
  },
}

module.exports = nextConfig