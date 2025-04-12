/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Fix for punycode deprecation warning
  webpack: (config, { isServer, dev }) => {
    // This is to suppress the punycode deprecation warning
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
    ];

    return config;
  },
  // Environment variables available during build
  env: {
    // Add fallback values for build time
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  },
  // Static page generation options
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation
};

module.exports = nextConfig;
