export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: 'default-jwt-secret-for-testing',
    },
  },
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250 MB
    },
  },
});
