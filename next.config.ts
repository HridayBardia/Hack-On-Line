import type { NextConfig } from "next";

// The site is exported as static files into out/ and served by Cloudflare.
// Security and caching headers are in public/_headers.
const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
