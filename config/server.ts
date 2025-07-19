export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env('APP_KEYS') ? env('APP_KEYS').split(',') : ['defaultKey1', 'defaultKey2'],
  },
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  admin: {
    url: env('ADMIN_URL', '/admin'),
  },
});
