/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.string('id').unique().primary();
    table.string('fullname').notNullable();
    table.string('mobile_number').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enu('role', ['ADMIN', 'USER']).defaultTo('USER');
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
