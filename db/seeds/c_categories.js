
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({id: 1, label: 'Category 1'}),
        knex('categories').insert({id: 2, label: 'Category 2'}),
        knex('categories').insert({id: 3, label: 'Category 3'}),
        knex('categories').insert({id: 4, label: 'Category 4'}),
        knex('categories').insert({id: 5, label: 'Category 5'})
      ]);
    });
};
