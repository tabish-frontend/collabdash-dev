/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["@jitsi/react-sdk"]);

const config = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withTM(config);
