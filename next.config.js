/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "lastfm.freetls.fastly.net", "i.scdn.co"],
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
