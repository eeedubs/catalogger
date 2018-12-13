
exports.up = function(knex, Promise) {
    return knex.schema.table('categories', function (table) {
        table.dropColumn('category_label_id');
        table.dropColumn('user_id');
    })
};
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('categories', function (table) {
        table.integer('category_label_id').references('category_label.id');
        table.integer('user_id').references('users.id');
    })
};
  