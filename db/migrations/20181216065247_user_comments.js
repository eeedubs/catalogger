
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_comments', function (table) {
        table.increments('id').primary();
        table.string('comment');
        table.string('user_name');
        table.integer('user_id').references('users.id').onDelete('cascade');
        table.integer('resource_id').references('resources.id').onDelete('cascade');
        table.string('time_created');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_comments');
  };
  