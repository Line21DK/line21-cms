export default ({ env }) => ({
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
  // Fix ES modules error
  webpack: {
    configure: (webpackConfig: any) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      return webpackConfig;
    },
  },
});
