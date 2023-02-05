/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV === 'development'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
}

export default nextConfig
