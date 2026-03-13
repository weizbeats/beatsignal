/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "http://localhost:8000/register"
      },
      {
        source: "/login",
        destination: "http://localhost:8000/login"
      },
      {
        source: "/scan",
        destination: "http://localhost:8000/scan"
      }
    ]
  }
}

module.exports = nextConfig