export default {
  routes: [
    {
      method: 'POST',
      path: '/webhook/github',
      handler: 'webhook.triggerGitHubAction',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/webhook/health',
      handler: 'webhook.health',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 