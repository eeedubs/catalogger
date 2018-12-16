
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({label: 'Category 1', user_id: 1}),
        knex('categories').insert({label: 'Category 2', user_id: 1}),
        knex('categories').insert({label: 'Category 3', user_id: 1}),
        knex('categories').insert({label: 'Category 4', user_id: 1}),
        knex('categories').insert({label: 'Category 5', user_id: 1}),
        knex('categories').insert({label: 'Category 1', user_id: 2}),
        knex('categories').insert({label: 'Category 2', user_id: 2}),
        knex('categories').insert({label: 'Category 3', user_id: 2}),
        knex('categories').insert({label: 'Category 4', user_id: 2}),
        knex('categories').insert({label: 'Category 5', user_id: 2}),
        knex('categories').insert({label: 'Category 1', user_id: 3}),
        knex('categories').insert({label: 'Category 2', user_id: 3}),
        knex('categories').insert({label: 'Category 3', user_id: 3}),
        knex('categories').insert({label: 'Category 4', user_id: 3}),
        knex('categories').insert({label: 'Category 5', user_id: 3}),
      ]);
    });
};
