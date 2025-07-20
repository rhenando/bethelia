/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  // ... any other configurations you might have
};

export default nextConfig;
