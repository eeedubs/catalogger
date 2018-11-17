
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', function (table) {
      table.increments('id');
      table.string('label');
      table.integer('category_label_id').references('category_label.id');
      table.integer('user_id').references('users.id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories');
};
