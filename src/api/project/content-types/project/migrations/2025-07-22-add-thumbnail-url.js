'use strict';

/**
 * This is a migration file that adds thumbnailUrl field to the project content type
 */

module.exports = {
  async up(knex) {
    // Add thumbnailUrl field
    await knex.schema.alterTable('projects', (table) => {
      table.string('thumbnailUrl').nullable();
    });
  },

  async down(knex) {
    await knex.schema.alterTable('projects', (table) => {
      table.dropColumn('thumbnailUrl');
    });
  },
}; 