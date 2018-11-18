
exports.up = function(knex, Promise) {
  return knex.schema.table('resources', function (table) {
    table.integer('created_by').references(users.id);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('resources', function (table) {
    table.dropColumn('created_by');
  })
};
