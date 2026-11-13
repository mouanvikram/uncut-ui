import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["shadcn", "@shadcn/registry"],
  outputFileTracingIncludes: {
    "/r/*": ["./registry.json", "./registry/**/*"],
  },
};

export default nextConfig;
