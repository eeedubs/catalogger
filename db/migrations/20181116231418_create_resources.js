
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', function (table) {
    table.increments('id');
    table.string('title');
    table.string('description');
    table.string('resourceURL');
    table.string('imageURL');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resources');
};
