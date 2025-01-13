/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  // output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: path.resolve("node_modules/crypto-browserify"),
      };
    }
    return config;
  },
};

export default nextConfig;
