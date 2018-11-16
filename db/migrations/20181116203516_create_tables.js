
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', function (table) {
    table.increments('id');
    table.string('title');
    table.string('description');
    table.string('resourceURL');
    table.string('imageURL');
  })
  return knex.schema.createTable('categories', function (table) {
    table.increments('id');
    table.string('label');
    table.foreign('category_id').references('categories.id');
    table.foreign('user_id').references('users.id');
  })
  return knex.schema.createTable('user_likes', function (table) {
    table.increments('id');
    table.foreign('user_id').references('users.id');
    table.foreign('resource_id').references('resources.id');
  })
  return knex.schema.createTable('user_comments', function (table) {
    table.increments('id');
    table.string('comment');
    table.foreign('user_id').references('users.id');
    table.foreign('resource_id').references('resources.id');
  })
  return knex.schema.createTable('user_ratings', function (table) {
    table.increments('id');
    table.foreign('user_id').references('users.id');
    table.foreign('resource_id').references('resources.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resources');
  return knex.schema.dropTable('categories');
  return knex.schema.dropTable('user_likes');
  return knex.schema.dropTable('user_comments');
  return knex.schema.dropTable('user_ratings');
};
