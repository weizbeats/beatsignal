import type { NextConfig } from "next"

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/register",
        destination: "http://localhost:8000/register",
      },
      {
        source: "/login",
        destination: "http://localhost:8000/login",
      },
      {
        source: "/scan",
        destination: "http://localhost:8000/scan",
      },
    ]
  },
}

export default nextConfig