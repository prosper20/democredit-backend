exports.up = function(knex) {
  return knex.schema.table('loans', (table) => {
    table.unique('id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('loans', (table) => {
    table.dropUnique('id');
  });
};
