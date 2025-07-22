export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: 'default-jwt-secret-for-testing',
    },
  },
  // upload: {
  //   config: {
  //     provider: 'ftp',
  //     providerOptions: {
  //       host: 'linux158.unoeuro.com',
  //       port: 21,
  //       user: 'line21.dk',
  //       password: 'Hx2rmkB9aFftb45ngzc6',
  //       secure: false, // true hvis du bruger FTPS
  //       basePath: '/public_html/uploads', // hvor billederne skal ligge på Simply
  //       baseUrl: 'https://line21.dk/uploads', // offentlig URL til billederne
  //     },
  //     sizeLimit: 250 * 1024 * 1024, // 250 MB
  //   },
  // },
});
