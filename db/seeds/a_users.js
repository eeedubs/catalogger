exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Alice's password is 'abc123'
        knex('users').insert({name: 'Alice', password: '$2b$10$1plrBdhTpuTcFhgsTiUT5O62naiX8mOzJq9lf43DZwSNB19v7ydtS'}),
        // Bob's password is 'def456'
        knex('users').insert({name: 'Bob', password: '$2b$10$ax2dhNCMniMa8hAaOoDwte4iXa9/vySX/cyleQtJFGh1lC5gGkIFy'}),
        // Charlie's password is 'ghi789'
        knex('users').insert({name: 'Charlie', password: '$2b$10$NRrkEyTfFW28X9HyJiM1uOPaYJNRp9PrhBl1cO3W1zkKh.CEE16au'}),
        // eeedub's password is '123'
        knex('users').insert({name: 'eeedubs', password: '$2b$10$ncnzOeetGSO5A1qVoxREhuURfglig1FRWNnob/vIdqjtYJ0iqug.e'})
      ]);
    });
};
