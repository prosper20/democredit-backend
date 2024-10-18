/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('loans', function(table) {
    table.string('id').unique().primary();
    table.string('loaner_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enu('status', ['PENDING', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED']).defaultTo('PENDING');
    table.decimal('amount', 10, 2).notNullable();
    table.decimal('interest_rate', 5, 2).notNullable();
    table.integer('duration').notNullable();
    table.decimal('total_repayment', 10, 2).notNullable();
    table.decimal('monthly_repayment', 10, 2).notNullable();
    table.decimal('total_interest', 10, 2).notNullable();
    table.decimal('total_paid', 10, 2).defaultTo(0);
    table.decimal('outstanding_balance', 10, 2).defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.up = function(knex) {
  return knex.schema.dropTableIfExists('loans')
    .then(() => {
      return knex.schema.createTable('loans', (table) => {
        table.string('id').primary();
        table.string('loaner_id');
        table.string('user_id');
        table.enu('status', ['PENDING', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED']).defaultTo('PENDING');
        table.decimal('amount', 10, 2).notNullable();
        table.decimal('interest_rate', 5, 2).notNullable();
        table.integer('duration').notNullable();
        table.decimal('total_repayment', 10, 2).notNullable();
        table.decimal('monthly_repayment', 10, 2).notNullable();
        table.decimal('total_interest', 10, 2).notNullable();
        table.decimal('total_paid', 10, 2).defaultTo(0);
        table.decimal('outstanding_balance', 10, 2).defaultTo(0);
        table.timestamps(true, true);
      });
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('loans');
};
