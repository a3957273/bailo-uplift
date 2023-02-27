/** @type {import('next').NextConfig} */

const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isDevelopment = process.env.NODE_ENV === 'development'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@bailo/shared'],

  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3001/api/:path*',
      },
    ]
  },

  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = withBundleAnalyzer(nextConfig)
