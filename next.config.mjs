/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/videos/:path*',
        destination: '/watch/:path*',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
