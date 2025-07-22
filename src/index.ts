import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Kør database bootstrap hvis vi er i production
    if (process.env.NODE_ENV === 'production') {
      try {
        console.log('🚀 Bootstrap: Starter database migration...');
        const bootstrapDb = require('../bootstrap-strapi.js');
        await bootstrapDb();
        console.log('✅ Bootstrap: Database migration færdig!');
      } catch (error) {
        console.error('❌ Bootstrap fejl:', error);
      }
    }
  },
};
// Force restart Wed Jul 23 00:14:14 CEST 2025
// Force restart Wed Jul 23 01:44:34 CEST 2025
