
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({label: 'Category 1', number: 1, user_id: 1}),
        knex('categories').insert({label: 'Category 2', number: 2, user_id: 1}),
        knex('categories').insert({label: 'Category 3', number: 3, user_id: 1}),
        knex('categories').insert({label: 'Category 4', number: 4, user_id: 1}),
        knex('categories').insert({label: 'Category 5', number: 5, user_id: 1}),
        knex('categories').insert({label: 'Category 1', number: 1, user_id: 2}),
        knex('categories').insert({label: 'Category 2', number: 2, user_id: 2}),
        knex('categories').insert({label: 'Category 3', number: 3, user_id: 2}),
        knex('categories').insert({label: 'Category 4', number: 4, user_id: 2}),
        knex('categories').insert({label: 'Category 5', number: 5, user_id: 2}),
        knex('categories').insert({label: 'Category 1', number: 1, user_id: 3}),
        knex('categories').insert({label: 'Category 2', number: 2, user_id: 3}),
        knex('categories').insert({label: 'Category 3', number: 3, user_id: 3}),
        knex('categories').insert({label: 'Category 4', number: 4, user_id: 3}),
        knex('categories').insert({label: 'Category 5', number: 5, user_id: 3}),
        knex('categories').insert({label: 'Category 1', number: 1, user_id: 4}),
        knex('categories').insert({label: 'Category 2', number: 2, user_id: 4}),
        knex('categories').insert({label: 'Category 3', number: 3, user_id: 4}),
        knex('categories').insert({label: 'Category 4', number: 4, user_id: 4}),
        knex('categories').insert({label: 'Category 5', number: 5, user_id: 4}),
      ]);
    });
};
