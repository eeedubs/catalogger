
exports.up = function(knex, Promise) {
  const createResources = knex.schema.createTable('resources', function (table) {
    table.increments('id');
    table.string('title');
    table.string('description');
    table.string('resourceURL');
    table.string('imageURL');
  }).return();

  const createCategoryLabels = knex.schema.createTable('category_label', function(tabel) {
    table.increments('id');
    table.string('name');
  }).return();

  const createCategories = createCategoryLabels
    .then(() => knex.schema.createTable('categories', function (table) {
      table.increments('id');
      table.string('label');
      table
        .integer('category_label_id')
        .references('categories_label.id');
      table
        .integer('user_id')
        .references('users.id');
    }).return());

  const createUserLikes =  createResources
    .then(() => knex.schema.createTable('user_likes', function (table) {
      table.increments('id');
      table.integer('user_id').references('users.id');
      table.integer('resource_id').references('resources.id');
    }).return());

  const createUserComments = createResources
    .then(() => knex.schema.createTable('user_comments', function (table) {
      table.increments('id');
      table.string('comment');
      table.integer('user_id').references('users.id');
      table.integer('resource_id').references('resources.id');
    }).return());

  const createUserRatings = createResources
    .then(() => knex.schema.createTable('user_ratings', function (table) {
      table.increments('id');
      table.foreign('user_id').references('users.id');
      table.foreign('resource_id').references('resources.id');
    }).return());

  return Promise.all([createResources, createCategories, createUserLikes, createUserComments, createUserRatings]);
};

exports.down = function(knex, Promise) {
  const dropUserLikes =  knex.schema.dropTable('user_likes').return();
  const dropUserComments = knex.schema.dropTable('user_comments').return();
  const dropUserRatings = knex.schema.dropTable('user_ratings').return();
  const dropCategories = knex.schema.dropTable('categories').return();
  const dropCategoryLabels = dropCategories
    .then(() => knex.schema.dropTable('categories_label').return());
  const dropResources = Promise.all([dropUserLikes, dropUserComments, dropUserRatings])
    .then(() => knex.schema.dropTable('resources'));
};
return Promise.all([dropUserRatings, dropUserComments, dropUserLikes, dropCategories, dropCategoryLabels, dropResources])
