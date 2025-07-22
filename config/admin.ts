export default ({ env }) => ({
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  auth: {
    secret: 'default-admin-jwt-secret',
  },
  apiToken: {
    salt: 'default-api-token-salt',
  },
  transfer: {
    token: {
      salt: 'default-transfer-token-salt',
    },
  },
  secrets: {
    encryptionKey: 'default-encryption-key',
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
