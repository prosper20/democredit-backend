/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.string('id').unique().primary();
    table.decimal('amount', 10, 2).notNullable();
    table.enu('type', ['DEPOSIT', 'WITHDRAWAL','DISBURSEMENT', 'REPAYMENT', 'TRANSFER']).notNullable();
    table.string('sender_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('receiver_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('loan_id').references('id').inTable('loans').onDelete('SET NULL').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
