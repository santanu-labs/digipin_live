import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@digipin/engine"],
  async redirects() {
    return [
      { source: "/sdk", destination: "/digipin-sdk", permanent: true },
      { source: "/gps", destination: "/digipin-gps", permanent: true },
      { source: "/api", destination: "/digipin-api", permanent: true },
    ];
  },
};

export default nextConfig;
