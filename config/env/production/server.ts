export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  app: {
    keys: ['defaultKey1', 'defaultKey2'],
  },
  url: env('PUBLIC_URL', 'https://line21-strapi-cms.onrender.com'),
}); 