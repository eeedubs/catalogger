exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('resources').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('resources').insert({id: 1, title: 'Bernese Mountain Dogs', description: "The Bernese Mountain Dog is a large, sturdy worker who can stand over 27 inches at the shoulder. The thick, silky, and moderately long coat is tricolored: jet black, clear white, and rust. The distinctive markings on the coat and face are breed hallmarks and, combined with the intelligent gleam in the dark eyes, add to the Berner’s aura of majestic nobility. A hardy dog who thrives in cold weather, the Berner’s brain and brawn helped him multitask on the farms and pastures of Switzerland.", resourceURL: 'https://www.akc.org/dog-breeds/bernese-mountain-dog/', imageURL: "http://www.thefurrtographer.com/wp-content/uploads/2015/03/03-519-post/FUR_3398-XL-1024x683.jpg", created_by: "1"}),
          knex('resources').insert({id: 2, title: "Sony A7R III Review: The New King of Mirrorless Cameras", description: "So yelling is fun...", resourceURL: "https://gizmodo.com/sony-a7r-iii-review-the-new-king-of-mirrorless-cameras-1822321331", imageURL: "https://nyppagesix.files.wordpress.com/2018/09/gary-busey.jpg?quality=90&strip=all", created_by: "1"}),
          knex('resources').insert({id: 3, title: 'Gary Oldman', description: "It's Oldman, old man!", resourceURL: "https://www.imdb.com/name/nm0000198/", imageURL: "https://media.vanityfair.com/photos/5a8f161f1d14714f6de43fbe/master/w_768,c_limit/Gary-Oldman-chameleon-SS05.jpg", created_by: "1"}),
          knex('resources').insert({id: 4, title: 'Steve Brule', description: "For your health!", resourceURL: "https://www.youtube.com/watch?v=K0igLdIH-Zc", imageURL: "https://pbs.twimg.com/profile_images/3543879283/1509e34005183da5ea4eb29150f341e5_400x400.jpeg", created_by: "1"})
        ]);
      });
  };