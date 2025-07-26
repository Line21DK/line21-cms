export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // enabled: true, // (enabled er ikke længere understøttet i v5)
      origin: [
        'https://line21.dk',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://line21-cms.onrender.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: '*',
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // 250 MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
