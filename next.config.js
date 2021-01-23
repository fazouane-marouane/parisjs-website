module.exports = {
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  env: {
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
    NEXT_PUBLIC_ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
    NEXT_PUBLIC_ALGOLIA_API_KEY: process.env.PUBLIC_ALGOLIA_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/en/submission/talk',
        destination: '/propositions/sujet',
        locale: false,
      },
      {
        source: '/en/sponsors',
        destination: '/partenaires',
        locale: false,
      },
    ]
  },
}
