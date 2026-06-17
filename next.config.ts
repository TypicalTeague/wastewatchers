import type { NextConfig } from "next";

const apiOrigin =
  process.env.WASTEWATCHERS_API_ORIGIN ?? "https://wastewatcher.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/wastewatchers/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
