
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('resources').insert({id: 1, title: 'Steve Buscemi', description: "I don't think of myself as having a career. I think of having jobs", resourceURL: 'https://en.wikipedia.org/wiki/Steve_Buscemi', imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Steve_Buscemi_2009_portrait.jpg/440px-Steve_Buscemi_2009_portrait.jpg", created_by: "1"}),
        knex('resources').insert({id: 2, title: "Gary Busey", description: "So yelling is fun...", resourceURL: "https://en.wikipedia.org/wiki/Gary_Busey", imageURL: "https://nyppagesix.files.wordpress.com/2018/09/gary-busey.jpg?quality=90&strip=all", created_by: "1"}),
        knex('resources').insert({id: 3, title: 'Gary Oldman', description: "It's Oldman, old man!", resourceURL: "https://www.imdb.com/name/nm0000198/", imageURL: "https://media.vanityfair.com/photos/5a8f161f1d14714f6de43fbe/master/w_768,c_limit/Gary-Oldman-chameleon-SS05.jpg", created_by: "1"}),
        knex('resources').insert({id: 4, title: 'Steve Brule', description: "For your health!", resourceURL: "https://www.youtube.com/watch?v=K0igLdIH-Zc", imageURL: "https://pbs.twimg.com/profile_images/3543879283/1509e34005183da5ea4eb29150f341e5_400x400.jpeg", created_by: "1"})
      ]);
    });
};
