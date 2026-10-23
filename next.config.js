  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/bo-su-tam",
          destination: "/bo-suu-tap",
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "https://dongphucunivi.com" },
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
            {
              key: "Access-Control-Allow-Headers",
              value:
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
            },
          ],
        },
      ];
    },
    images: {

      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
        {
          protocol: "https",
          hostname: "images.pexels.com",
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
        },
        {
          protocol: "https",
          hostname: "live.staticflickr.com",
        },
        {
          protocol: "https",
          hostname: "dongphucunivi.com",
        },
        {
          protocol: "https",
          hostname: "img.dongphucunivi.com",
        },
        {
          protocol: "https",
          hostname: "**.dongphucunivi.com",
        },
        {
          protocol: "https",
          hostname: "example.com",
        },
        {
          protocol: "https",
          hostname: "scontent.fhan18-1.fna.fbcdn.net",
        },
        {
          protocol: "https",
          hostname: "**.r2.dev",
        },
        {
          protocol: "https",
          hostname: "**.r2.cloudflarestorage.com",
        },
      ],
    },
  };

  module.exports = nextConfig;
