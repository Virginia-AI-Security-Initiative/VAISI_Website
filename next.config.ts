import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/2026policyhackathon/:path*",
        destination: "/2026policycompetition/:path*",
        permanent: true,
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
