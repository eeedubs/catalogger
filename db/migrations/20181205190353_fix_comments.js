
exports.up = function(knex, Promise) {
    return knex.schema.table('user_comments', function (table) {
        table.string('user_name');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('user_comments', function (table) {
        table.dropColumn('user_name');
    })
};
