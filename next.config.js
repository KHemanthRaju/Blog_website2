/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now available by default in Next.js 14.0.3
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Increase API body size limit for image uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig