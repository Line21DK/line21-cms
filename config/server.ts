export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  app: {
    keys: ['defaultKey1', 'defaultKey2'],
  },
  url: env('PUBLIC_URL', 'http://localhost:10000'),
  admin: {
    url: env('ADMIN_URL', '/admin'),
  },
});
