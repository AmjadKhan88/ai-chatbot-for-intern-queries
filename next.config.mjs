/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows the app to read files from the /knowledge-base directory at runtime.
  // serverComponentsExternalPackages ensures Node.js 'fs' module works in Server Components.
  experimental: {
    serverComponentsExternalPackages: ["gray-matter"],
  },
};

export default nextConfig;
