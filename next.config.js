/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', '@fusionstrings/panchangam'],
  },
  // Required for @fusionstrings/panchangam WASM binary
  webpack(config, { isServer }) {
    // Allow .wasm files to be loaded
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }

    // Ensure WASM files are treated as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
}

module.exports = nextConfig
