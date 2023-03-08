/** @type {import('next').NextConfig} */

import path from 'path'
import { fileURLToPath } from 'url'

import bundleAnalyzer from '@next/bundle-analyzer'
import nextMDX from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMermaid from 'mdx-mermaid'
import rehypeHighlight from 'rehype-highlight'
import removeImports from 'next-remove-imports'

const withRemoveImports = removeImports()

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMermaid, remarkGfm, remarkFrontmatter],
    rehypePlugins: [rehypeHighlight],
  },
})

const isDevelopment = process.env.NODE_ENV === 'development'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@bailo/shared', 'nanoid', 'lodash-es', '@uiw/react-textarea-code-editor'],

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

  compiler: {
    emotion: true,
  },
  swcMinify: true,

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['__tests__', 'cypress', 'data', 'lib', 'pages', 'server', 'src', 'types', 'utils'],
  },

  experimental: {
    swcTraceProfiling: true,
    outputFileTracingRoot: path.join(fileURLToPath(new URL('.', import.meta.url)), '../../'),
  },
}

export default withRemoveImports(withBundleAnalyzer(withMDX(nextConfig)))
