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

  // Tesseract loads its worker script, wasm core and language data at runtime,
  // so they are invisible to file tracing. Without these the OCR worker never
  // starts on serverless and image submissions hang forever.
  outputFileTracingIncludes: {
    '/api/analyze-media': [
      './node_modules/tesseract.js/**/*',
      './node_modules/tesseract.js-core/**/*',
      './node_modules/wasm-feature-detect/**/*',
      './node_modules/regenerator-runtime/**/*',
      './node_modules/is-url/**/*',
      './node_modules/bmp-js/**/*',
      './node_modules/zlibjs/**/*',
      './node_modules/whatwg-url/**/*',
      './node_modules/tr46/**/*',
      './node_modules/webidl-conversions/**/*',
      './eng.traineddata',
    ],
  },

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