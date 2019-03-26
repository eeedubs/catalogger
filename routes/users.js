// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express       = require('express');
const router        = express.Router();
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt        = require ("bcrypt");
const uuidv1        = require('uuid/v1');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


module.exports = (knex) => {
  
  const knexQueries = require('../lib/knex-queries')(knex);

  // gets all the categories (NOT THE RESOURCES) for a given user
  router.get("/categories", (req, res) => {
    let sessionID = req.session.user_id;
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.getCategoriesByUserID(userID, (error, results) => {
          if (error){
            console.log('Error getting user by name.', error.message)
            res.status(500).json({ error: error.message })
          } else {
            res.json(results);
          }
        })
      }
    })
  })

  router.get("/resources/liked", (req, res) => {
    let sessionID = req.session.user_id;
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.getLikedResources(userID, (error, results) => {
          if (error){
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            res.json(results);
          }
        })
      }
    })
  })

  router.get("/resources", (req, res) => {
    let sessionID = req.session.user_id;
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.getLikedOrPostedResources(userID, (error, results) => {
          if (error){
            console.log('Error getting user by name.', error.message)
            res.status(500).json({ error: error.message })
          } else {
            res.json(results);
          }
        })
      }
    })
  })

  router.post("/change-info", (req, res) => {
    let { userName, oldPass, newPass, newPassConfirm } = req.body;
    if (!userName || !oldPass || !newPass || !newPassConfirm){
      alert("You are missing some of the required information.");
      return;
    }
    if (newPass !== newPassConfirm){
      alert("Your new passwords do not match. Please try again.");
      return;
    }
    knexQueries.getUserByName(userName, (error, userExists) => {
      if (error){
        console.log('Error getting user by name.', error.message)
        res.status(500).json({ error: error.message })
      } else {
        if (userExists[0]){
          if (bcrypt.compareSync(oldPass, userExists[0].password)){
            let newPassHashed = bcrypt.hashSync(newPass, 10);
            knexQueries.updateUserPassword(userExists[0].id, newPassHashed, (error, newPassResults) => {
              if (error){
                console.log('Error getting user by name.', error.message)
                res.status(500).json({ error: error.message })
              } else {
                oldPass, newPass, newPassConfirm, userExists = null;
                res.redirect("/");
              }
            })
          } else {
            alert("The credentials you have entered for this user are incorrect.");
            return;
          }
        } else {
          alert("The credentials you have entered for this user are incorrect.");
        } 
      }
    })
  });

  router.post("/change-categories", (req, res) => {
    let {
      newCat1, newCat2, newCat3, newCat4, newCat5, 
      cat1ID, cat2ID, cat3ID, cat4ID, cat5ID
    } = req.body;
    let categoryLabelArray = [newCat1, newCat2, newCat3, newCat4, newCat5];
    let categoryIDArray = [cat1ID, cat2ID, cat3ID, cat4ID, cat5ID];
    for (let i = 0; i < categoryLabelArray.length; i++){
      if (categoryLabelArray[i]){
        knexQueries.renameCategoryLabel(categoryIDArray[i], categoryLabelArray[i], (error, results) => {
          if (error){
            console.log('Error getting user by name.', error.message)
            res.status(500).json({ error: error.message })
          }
        })
      }
    }
    res.redirect("/");
  })

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    let { loginUsername, loginPassword } = req.body;
    let uniqueID = uuidv1();
    if (!loginUsername || !loginPassword){
      res.status(400).send("400 Bad Request Error: username and/or password missing.");
    } else {
      knexQueries.getUserByName(loginUsername, (error, userExists) => {
        if (error){
          console.log('Error getting user by name.', error.message)
          res.status(500).json({ error: error.message })
        } else {
          if (userExists[0]){
            if (bcrypt.compareSync(loginPassword, userExists[0].password)){
              loginPassword, userExists = null;
              knexQueries.updateCookie(uniqueID, loginUsername, (error, cookieResults) => {
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
    let { registerUsername, registerPassword } = req.body;
    let uniqueID = uuidv1();
    if (!registerUsername || !registerPassword){
      res.status(400).send("400 Bad Request Error: username and/or password are missing.");      
    } else {
      let hashedPassword = bcrypt.hashSync(registerPassword, 10);
      registerPassword = null;
      knexQueries.getUserByName(registerUsername, (error, usernameResults) => {
        if (error){
          console.log('Error getting user by name.', error.message)
          res.status(500).json({ error: error.message });
        } else {
          if (usernameResults[0]){
            res.status(400).send("400 Bad Request Error: an account with this username already exists.");
          } else {
            knexQueries.postUser(registerUsername, hashedPassword, uniqueID, (error, postUserResults) => {
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
    let { userComment, userName } = req.body;
    let userID      = JSON.parse(req.body.userID);
    let resourceID  = JSON.parse(req.body.resourceID);
    if (!userComment){
      res.status(400).send("400 Bad Request Error: comment input is empty.");
    } else if (!userName || !userID){
      res.status(400).send("400 Bad Request Error: missing user credentials. Please log in to post comments.");
    } else if (!resourceID){
      res.status(500).send("500 Internal Server Error: missing the resource ID number.");
    } else {
      knexQueries.postComment(userComment, userName, userID, resourceID, (error, commentResults) => {
        if (error){
          console.log('Error posting comment to the database.', error.message)
          res.status(500).json({ error: error.message });
        } else {
          res.status(200).json({
            success: true
          })
        }
      })
    }
  })

  return router;

}
