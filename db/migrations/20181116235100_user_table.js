
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_comments', function (table) {
      table.increments('id');
      table.string('comment');
      table.integer('user_id').references('users.id');
      table.integer('resource_id').references('resources.id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_comments');
};
