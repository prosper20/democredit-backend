/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('loan_offers', function(table) {
    table.string('id').unique().primary();
    table.string('name').notNullable();
    table.integer('tenure').notNullable();
    table.decimal('max_amount', 10, 2).notNullable();
    table.decimal('interest_rate', 5, 2).notNullable(); 
    table.string('loaner_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('loan_offers');
};
