
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', function (table) {
        table.increments('id').primary();
        table.string('label');
        table.integer('number');
        table.integer('user_id').references('users.id')
        table.specificType('resources', 'integer ARRAY');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories');
  };