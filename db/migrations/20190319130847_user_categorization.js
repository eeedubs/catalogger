
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resource_categorization', function (table) {
      table.increments('id').primary();
      table.integer('user_id').references('users.id').onDelete('cascade');
      table.integer('resource_id').references('resources.id').onDelete('cascade');
      table.integer('category_id').references('categories.id').onDelete('cascade');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resource_categorization');
};
