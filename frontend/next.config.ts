import type { NextConfig } from "next"

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/register",
        destination: "https://beatsignal-production.up.railway.app/register",
      },
      {
        source: "/login",
        destination: "https://beatsignal-production.up.railway.app/login",
      },
      {
        source: "/scan",
        destination: "https://beatsignal-production.up.railway.app/scan",
      },
    ]
  },
}

export default nextConfig