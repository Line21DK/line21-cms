'use strict';

/**
 * This is a migration file that adds featuredVideo and featuredImages fields to the project content type
 */

module.exports = {
  async up(knex) {
    // Add featuredVideo field (component)
    await knex.schema.alterTable('projects', (table) => {
      // featuredVideo will be stored as JSON in the database
      table.json('featuredVideo');
    });

    // Add featuredImages field (media relation)
    // This will be handled by Strapi's media system
    await knex.schema.alterTable('projects', (table) => {
      // featuredImages will be stored as JSON array of media IDs
      table.json('featuredImages');
    });

    // Add featuredImagesTitle field
    await knex.schema.alterTable('projects', (table) => {
      table.string('featuredImagesTitle').defaultTo('Featured Images');
    });

    // Add featuredImagesDescription field
    await knex.schema.alterTable('projects', (table) => {
      table.text('featuredImagesDescription');
    });
  },

  async down(knex) {
    await knex.schema.alterTable('projects', (table) => {
      table.dropColumn('featuredVideo');
      table.dropColumn('featuredImages');
      table.dropColumn('featuredImagesTitle');
      table.dropColumn('featuredImagesDescription');
    });
  },
}; 