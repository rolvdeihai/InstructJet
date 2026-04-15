import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 1. Move this to the top level (fixes the Tesseract module error)
  serverExternalPackages: ['tesseract.js'],

  // 2. Move this to the top level (fixes the TS2353 error)
  // This tells Next.js you acknowledge you are using Turbopack
  turbopack: {},

  // 3. Keep experimental for other features, or remove if empty
  experimental: {
     // serverComponentsExternalPackages is NOT here anymore
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'tesseract.js'];
    }
    return config;
  },
};

export default nextConfig;