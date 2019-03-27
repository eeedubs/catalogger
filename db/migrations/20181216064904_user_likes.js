
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_likes', function (table) {
        table.increments('id').primary();
        table.integer('user_id').references('users.id').onDelete('cascade');
        table.integer('resource_id').references('resources.id').onDelete('cascade');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_likes');
  };
  