
exports.up = function(knex, Promise) {
    return knex.schema.table('user_comments', function (table) {
        table.string('time_created');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('user_comments', function (table) {
        table.dropColumn('time_created');
    })
};
