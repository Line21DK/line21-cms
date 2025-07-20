export default {
  async check(ctx) {
    const result = await strapi.service('api::health.health').check();
    ctx.body = result;
  },
}; 