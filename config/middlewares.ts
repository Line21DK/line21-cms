export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: 'https://line21.dk',
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
