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

    getCategoriesByUserID: (userID, callback) => {
      knex
      .select('*')
      .from('categories')
      .where('user_id', '=', userID)
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    getCategoryIDByName: (catName, userID, callback) => {
      knex
      .select('id')
      .from('categories')
      .where('label', '=', catName)
      .andWhere('user_id', '=', userID)
      .then((results) => {
        callback(null, results)
      })
      .catch(error => callback(error))
    },

    getAllResourcesMatchingCategoryID: (catID, userID, callback) => {
      console.log(catID);
      knex
        .select('*')
        .from('resource_categorization')
        .where('resource_categorization.category_id', '=', catID)
        .andWhere('resource_categorization.user_id', '=', userID)
        .join('resources', 'resources.id', '=', 'resource_categorization.resource_id')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error));
    },

    checkCategorization: (userID, resourceID, catID, callback) => {
      knex
      .select('*')
      .from('resource_categorization')
      .where('user_id', '=', userID)
      .andWhere('resource_id', '=', resourceID)
      .andWhere('category_id', '=', catID)
      .limit(1)
      .then((results) => {
        console.log(results);
        callback(null, results);
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
          user_id: userID,
          resource_id: resourceID,
          time_created: Date.now()
        })
        .returning('*')
        .then((results) => {
          console.log(results);
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
    
    categorizeResource: (userID, resourceID, catID, callback) => {
      knex('resource_categorization')
      .insert({
        user_id: userID,
        resource_id: resourceID,
        category_id: catID
      })
      .returning('*')
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },
  }
}