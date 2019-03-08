module.exports = (knex) => {
  return {

    getCookieByUserID: (userID, callback) => {
      knex
        .select('*')
        .from('users')
        .where('id', '=', userID)
        .limit(1)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getUserBySessionID: (sessionID, callback) => {
      knex
        .select('*')
        .from('users')
        .where('cookie_session', '=', sessionID)
        .limit(1)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getUserByName: (username, callback) => {
      knex
        .select('*')
        .from('users')
        .where('name', '=', username)
        .limit(1)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getAllResources: (callback) => {
      knex
        .select('*')
        .from('resources')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getAllComments: (callback) => {
      knex
        .select('*')
        .from('user_comments')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getArrayOfResourceIDsFromCategory: (userID, categoryNumber, callback) => {
      knex
        .select('resources')
        .from('categories')
        .where('user_id', '=', userID)
        .andWhere('number', '=', categoryNumber)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getAllResourcesFromArrayOfResourceIDs: (arrayOfResourceIDs, callback) => {
      let objectToReturn = {};
      arrayOfResourceIDs.forEach((resource) => {
        knex
          .select('*')
          .from('resources')
          .where('id', '=', resource.id)
          .then((eachResult) => {
            objectToReturn[eachResult];
          })
          .catch(error => callback(error))
        }).then(() => {
          callback(null, objectToReturn);
        })
        .catch(error => callback(error));
    },

    updateCookie: (newSessionID, username, callback) => { 
      knex('users')
      .update('cookie_session', newSessionID)
      .where('name', '=', username)
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    postResource: (url, title, image, description, userID, callback) => {
      knex('resources')
        .insert({
          resourceURL: url,
          title: title,
          imageURL: image,
          description: description,
          created_by: userID
        })
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    postUser: (username, hashedPassword, cookieSessionID, callback) => {
      knex('users')
        .insert({
          name: username,
          password: hashedPassword,
          cookie_session: cookieSessionID
        })
        .returning('*')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    postComment: (comment, username, userID, resourceID, callback) => {
      knex('user_comments')
        .insert({
          comment: comment,
          user_name: username,
          time_created: Date.now(),
          user_id: userID,
          resource_id: resourceID
        })
        .then(() => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    createCategories: (userID, callback) => {
      knex('categories')
      .insert([
        { label: 'Category 1', number: 1, user_id: userID },
        { label: 'Category 2', number: 2, user_id: userID },
        { label: 'Category 3', number: 3, user_id: userID },
        { label: 'Category 4', number: 4, user_id: userID },
        { label: 'Category 5', number: 5, user_id: userID }
      ])
      .returning('*')
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },
    
  }
}