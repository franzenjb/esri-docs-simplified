/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  publicRuntimeConfig: {
    appName: 'Esri Docs Simplified',
    appVersion: '1.0.0'
  }
}

module.exports = nextConfig