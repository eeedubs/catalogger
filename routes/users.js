// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express       = require('express');
const router        = express.Router();
const cookie        = require('cookie-parser');
const bodyParser    = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt        = require ("bcrypt");
const uuidv1        = require('uuid/v1');


module.exports = (knex) => {
  
  const knexQueries = require('../lib/knexqueries')(knex);

  router.get('/comments', (req, res) => {
    knexQueries.getAllComments((error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    })
  })

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    let username = req.body.loginUsername;
    let password = req.body.loginPassword;
    let uniqueID = uuidv1();
    if (!username || !password){
      res.status(400).send("400 Bad Request Error: username and/or password missing.");
    } else {
      knexQueries.getUserByName(username, (error, userExists) => {
        if (error){
          console.log('Error getting user by name.', error.message)
          res.status(500).json({ error: error.message })
        } else {
          if (userExists[0]){
            if (bcrypt.compareSync(password, userExists[0].password)){
              password, userExists = null;
              knexQueries.updateCookie(uniqueID, username, (error, cookieResults) => {
                if (error){
                  console.log('Error updating the cookie.', error.message)
                  res.status(500).json({ error: error.message });
                } else {
                  req.session.user_id = uniqueID;
                  res.redirect('/');
                }
              })
            } else {
              res.status(400).send("400 Bad Request Error: username and/or password is incorrect.");
            }
          } else {
            res.status(400).send("400 Bad Request Error: username and/or password is incorrect.");
          }
        }
      })
    }
  })

  // REGISTER NEW USER ROUTE
  router.post("/register", (req, res) => {
    let username = req.body.registerUsername;
    let password = req.body.registerPassword;
    let uniqueID = uuidv1();
    if (!username || !password){
      res.status(400).send("400 Bad Request Error: username and/or password are missing.");      
    } else {
      let hashedPassword = bcrypt.hashSync(password, 10);
      password = null;
      knexQueries.getUserByName(username, (error, usernameResults) => {
        if (error){
          console.log('Error getting user by name.', error.message)
          res.status(500).json({ error: error.message });
        } else {
          if (usernameResults[0]){
            res.status(400).send("400 Bad Request Error: an account with this username already exists.");
          } else {
            knexQueries.postUser(username, hashedPassword, uniqueID, (error, postUserResults) => {
              if (error){
                console.log('Error posting user.', error.message)
                res.status(500).json({ error: error.message });
              } else {
                knexQueries.createCategories(postUserResults[0].id, (error, createCategoryResults) => {
                  if (error){
                    console.log('Error creating categories.', error.message)
                    res.status(500).json({ error: error.message });
                  } else {
                    req.session.user_id = uniqueID;
                    res.redirect('/');
                  }
                })
              }
            })
          }
        }
      })
    }
  })

  // LOGOUT USER
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
  })

  // Comment On Resource
  router.post("/comment", (req, res) => {
    let userComment = req.body.commentInput;
    let sessionID   = req.session.user_id;
    let resourceID  = req.body.resourceId;
    let username    = req.body.user.name;
    let userID      = req.body.user.id;
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error){
        console.log('Error getting user by name.', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.postComment(userComment, username, userID, resourceID, (error, commentResults) => {
          if (error){
            console.log('Error getting user by name.', error.message)
            res.status(500).json({ error: error.message });
          } else {
            res.status(201);
          }
        })
      }
    })
  })
  
  // router.post("/categorize", (req, res) => {
  //   const categoryNumber = req.body.category;
  //   const resourceId = req.body.resourceId;
  //   const userId = req.session.user_id;
  //   knex('categories')
  //   .select('*')
  //   .where('user_id', '=', userId)
  //   .andWhere('number', '=', categoryNumber)
  //   .then((results) => {
  //     return knex('category_resources')
  //       .insert({
  //         resource_id: resourceId,
  //         category_id: results[0].id,
  //         user_id: userId
  //       })
  //       .then(() => {
  //         res.status(201);
  //       })
  //     })
  //   })

  return router;

}
