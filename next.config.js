/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lastfm.freetls.fastly.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
      },
    ],
  },
};

/*
  ==================================================
            FOR ANALYZING BUNDLE SIZES
  ==================================================

  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });

  module.exports = withBundleAnalyzer(nextConfig);
*/

module.exports = nextConfig;
