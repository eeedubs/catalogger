
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_ratings', function (table) {
        table.increments('id').primary();
        table.integer('rating');
        table.integer('user_id').references('users.id');
        table.integer('resource_id').references('resources.id');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_ratings');
  };
  