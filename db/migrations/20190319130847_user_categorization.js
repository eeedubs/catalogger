
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resource_categorization', function (table) {
      table.increments('id').primary();
      table.integer('user_id').references('users.id');
      table.integer('resource_id').references('resources.id');
      table.integer('category_id').references('categories.id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categorization');
};
