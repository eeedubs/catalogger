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
      .select('resources.id', 'resources.title', 'resources.description', 'resources.resourceURL', 'resources.imageURL', 'resources.created_by', 'resources.time_created', 'users.name as username')
      .from('resources')
      .join('users', 'users.id', '=', 'resources.created_by')
      .orderBy('resources.id')
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

    getLikes: (callback) => {
      knex
        .select('*')
        .from('user_likes')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    getRatings: (callback) => {
      knex
      .select('*')
      .from('user_ratings')
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    checkIfLiked: (userID, resourceID, callback) => {
      knex
        .select('*')
        .from('user_likes')
        .where('user_id', '=', userID)
        .andWhere('resource_id', '=', resourceID)
        .limit(1)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    checkIfRated: (userID, resourceID, callback) => {
      knex
      .select('*')
      .from('user_ratings')
      .where('user_id', '=', userID)
      .andWhere('resource_id', '=', resourceID)
      .limit(1)
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
        .orderBy('id')
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
      knex
        .select('resources.id', 'resources.title', 'resources.description', 'resources.resourceURL', 'resources.imageURL', 'resources.created_by', 'resources.time_created', 'users.name as username', 'categories.id as cat_id')
        .from('resources')
        .where('resource_categorization.category_id', '=', catID)
        .andWhere('resource_categorization.user_id', '=', userID)
        .join('resource_categorization', 'resource_categorization.resource_id', '=', 'resources.id')
        .join('users', 'users.id', '=', 'resources.created_by')
        .join('categories', 'categories.id', '=', 'resource_categorization.category_id')
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error));
    },

    getLikedResources: (userID, callback) => {
      knex
      .select('resources.id', 'resources.title', 'resources.description', 'resources.resourceURL', 'resources.imageURL', 'resources.created_by', 'resources.time_created', 'users.name as username')
      .from('user_likes')
      .where('user_likes.user_id', '=', userID)
      .join('resources', 'resources.id', '=', 'user_likes.resource_id')
      .join('users', 'resources.created_by', '=', 'users.id')
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error));
    },

    getLikedOrPostedResources: (userID, callback) => {
      knex
        .distinct('user_likes.resource_id', 'resources.id')
        .select('resources.id', 'resources.title', 'resources.description', 'resources.resourceURL', 'resources.imageURL', 'resources.time_created', 'resources.created_by', 'users.name as username')
        .from('user_likes')
        .where('user_likes.user_id', '=', userID)
        .orWhere('resources.created_by', '=', userID)
        .join('resources', 'resources.id', '=', 'user_likes.resource_id')
        .join('users', 'resources.created_by', '=', 'users.id')
        .then((results) => {
          let filteredResourceObject  = {};
          for (let eachResource of results){
            if (!filteredResourceObject[eachResource.resource_id]){
              filteredResourceObject[eachResource.resource_id] = eachResource;
            }
          }
          let filteredArray = Object.values(filteredResourceObject);
          callback(null, filteredArray);
        })
        .catch(error => callback(error));
    },

    getResourcesBySearchQuery: (searchQuery, callback) => {
      knex
      .select('resources.id', 'resources.title', 'resources.description', 'resources.resourceURL', 'resources.imageURL', 'resources.created_by', 'resources.time_created', 'users.name as username')
      .from('resources')
      .whereRaw('LOWER(resources.description) LIKE ?', [`%${searchQuery}%`])
      .orWhereRaw('LOWER(resources.title) LIKE ?', [`%${searchQuery}%`])
      .join('users', 'resources.created_by', '=', 'users.id')
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

    updateUserPassword: (userID, newPassword, callback) => {
      knex('users')
      .update('password', newPassword)
      .where('id', '=', userID)
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
          created_by: userID,
          time_created: Date.now()
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
          callback(null, results);
        })
        .catch(error => callback(error))
    },

    postLike: (userID, resourceID, callback) => {
      knex('user_likes')
        .insert({
          user_id: userID,
          resource_id: resourceID
        })
        .then(() => {
          knex('user_likes')
            .where('resource_id', '=', resourceID)
            .then((results) => {
              callback(null, results);
            })
            .catch(error => callback(error))
        })
        .catch(error => callback(error))
    },

    postRating: (rating, userID, resourceID, callback) => {
      knex('user_ratings')
      .insert({
        rating: rating,
        user_id: userID,
        resource_id: resourceID
      })
      .then(() => {
        knex('user_ratings')
        .where('resource_id', '=', resourceID)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
      })
      .catch(error => callback(error))
    },

    updateRating: (rating, userID, resourceID, callback) => {
      knex('user_ratings')
      .where('user_id', '=', userID)
      .andWhere('resource_id', '=', resourceID)
      .update({ 'rating': rating })
      .then(() => {
        knex('user_ratings')
        .where('resource_id', '=', resourceID)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
      })
      .catch(error => callback(error))
    },

    renameCategoryLabel: (catID, newLabel, callback) => {
      knex('categories')
      .where('id', '=', catID)
      .update({ 'label': newLabel })
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    createCategories: (userID, callback) => {
      knex('categories')
      .insert([
        { label: 'Category 1', user_id: userID },
        { label: 'Category 2', user_id: userID },
        { label: 'Category 3', user_id: userID },
        { label: 'Category 4', user_id: userID },
        { label: 'Category 5', user_id: userID }
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

    deleteLike: (userID, resourceID, callback) => {
      knex('user_likes')
      .where('user_id', '=', userID)
      .andWhere('resource_id', '=', resourceID)
      .limit(1)
      .del()
      .then(() => {
        knex('user_likes')
        .where('resource_id', '=', resourceID)
        .then((results) => {
          callback(null, results);
        })
        .catch(error => callback(error))
      })
      .catch(error => callback(error))
    },

    deleteUser: (userID, callback) => {
      knex('users')
      .where('id', '=', userID)
      .limit(1)
      .del()
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    deleteResource: (resourceID, callback) => {
      knex('resources')
      .where('id', '=', resourceID)
      .limit(1)
      .del()
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    deleteComment: (commentID, callback) => {
      knex('user_comments')
      .where('id', '=', commentID)
      .limit(1)
      .del()
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },

    removeFromCategory: (userID, resourceID, catID, callback) => {
      knex('resource_categorization')
      .where('user_id', '=', userID)
      .andWhere('resource_id', '=', resourceID)
      .andWhere('category_id', '=', catID)
      .limit(1)
      .del()
      .then((results) => {
        callback(null, results);
      })
      .catch(error => callback(error))
    },


  }
}