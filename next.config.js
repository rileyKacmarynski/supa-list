module.exports = {
  experimental: {
    esmExternals: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ]
  },
}
