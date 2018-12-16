
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_likes', function (table) {
        table.increments('id');
        table.integer('user_id').references('users.id');
        table.integer('resource_id').references('resources.id');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_likes');
  };
  