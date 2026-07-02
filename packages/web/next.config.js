/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/lsp-ai-audit' : '',
  transpilePackages: ['@lsp/ui', '@lsp/shared', '@lsp/viz'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
