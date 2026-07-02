/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lsp/ui', '@lsp/shared', '@lsp/viz'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
};
module.exports = nextConfig;
