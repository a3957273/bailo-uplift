/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
}

module.exports = nextConfig
