
exports.up = function(knex, Promise) {
    return knex.schema.createTable('resources', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('description', 1000);
      table.string('resourceURL');
      table.string('imageURL');
      table.integer('created_by').references('users.id');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('resources');
  };

