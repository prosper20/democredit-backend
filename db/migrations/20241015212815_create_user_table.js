/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary();
    table.string('fullname').notNullable();
    table.string('mobile_number').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enu('role', ['admin', 'user']).defaultTo('user');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
