// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt      = require ("bcrypt");
const uuidv1 = require('uuid/v1');


module.exports = (knex) => {

  // LOAD ALL RESOURCES FOR HOME PAGE
  router.get('/resources', (req, res) => {
    knex('resources')
      .select('*')
      .then((resources) => {
        // Sends the resources in JSON format
        res.json(resources);
      })
    })


    // router.get("/categories/:id", (req, res) => {
    //   let id = req.params.id;
    //   knex('resources')
    //   .select('*')
    //   .where('number 

    // })

  // I need to figure out how to pass two different sets of parameters to app.js
  // The resources have been sent successfully, but not the comments


  router.get("/comments", (req, res) => {
    knex 
    .select("*")
    .from("user_comments")
    .then((comments) => {
      comments.forEach((comment) => {
        console.log(JSON.stringify(comment) + "\n");
      })
      res.json(comments);
    });
  });

  router.get("/user_id", (req, res) => {
    knex
    .select('*')
    .from('users')
    .where("cookie_session", "=", req.session.user_id)
    .then((user) => {
      res.json(user);
    })
  })

// REGISTER NEW USER ROUTE
  router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let uniqueId = uuidv1();
    if (!username && !password){
      res.status(400).send("400 Bad Request Error: username and password are missing.");      
    } else if (!username){
      res.status(400).send("400 Bad Request Error: username is missing.");
    } else if (!password){
      res.status(400).send("400 Bad Request Error: password is missing.");
    } else {
      let hashedPassword = bcrypt.hashSync(password, 10);
      password = null;
      knex('users')
      .select('*')
      .where('name', '=', username)
      .then((results) => {
        if (results[0]){
          res.status(400).send("400 Bad Request Error: an account with this username already exists.");
        } else {
          return knex('users')
          .insert({
            name: username,
            password: hashedPassword,
            cookie_session: uniqueId
          })
          .then(() => {
            return knex('users')
            .select('id')
            .where('name', '=', username)
            .then((data) => {
              return knex('categories')
              .insert([
                { label: 'Category 1', number: 1, user_id: data[0].id },
                { label: 'Category 2', number: 2,user_id: data[0].id },
                { label: 'Category 3', number: 3, user_id: data[0].id },
                { label: 'Category 4', number: 4, user_id: data[0].id },
                { label: 'Category 5', number: 5, user_id: data[0].id }
              ])
              .then(() => {
                req.session.user_id = uniqueId;
                res.redirect('/');
              })
            })
          })
        }
      })
    }
  });

  // LOGIN HELPER FUNCTION
  // function loginKnex (username, password){
  //   return knex('users')
  //   .select('*')
  //   .where('name', '=', username)
  //   .then((exists) => {
  //     if (exists[0]){
  //       if (bcrypt.compareSync(password, exists[0].password)){
  //       // if (exists[0].password === password){
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   })
  // }

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let uniqueId = uuidv1();
    if (!username){
      res.status(400).send("400 Bad Request Error: username is missing.");
    }
    else if (!password){
      res.status(400).send("400 Bad Request Error: password is missing.");
    } else {
      knex('users')
      .select('*')
      .where('name', '=', username)
      .then((exists) => {
        if (exists[0]){
          if (bcrypt.compareSync(password, exists[0].password)){
            password = null;
            return knex('users')
            .update('cookie_session', uniqueId)
            .where('name', '=', username)
            .then(() => {
              req.session.user_id = uniqueId;
              res.redirect('/');
            })
          } else {
            res.status(400).send("400 Bad Request Error: username and/or password is incorrect.");
            // res.redirect(400, '/register');
          }
        } else {
          res.status(400).send("400 Bad Request Error: username and/or password is incorrect.");
          // res.redirect(400, '/register');
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
    const userComment = req.body.commentInput;
    const userId = req.session.user_id;
    const resourceId = req.body.resourceId;
    knex('users')
      .select('*')
      .where('cookie_session', '=', userId)
      .then((result) => {
        let username = result[0].name;
        let userId = results[0].id;
        // console.log("The user's ID is: ", userId);
        return knex('user_comments')
          .insert({
            comment: userComment,
            user_name: username,
            time_created: Date.now(),
            user_id: userId,
            resource_id: resourceId
          })
          .then(() => {
            res.status(201);
          });
        })
      });

  // LIKE ROUTE
  // router.post("like", (req, res) => {
  //   knex('user_comments')
  //     .insert({
  //       comment: comment
  //     })
  //     .then((results) => {
  //       res.redirect("/")
  //     });
  // })

  return router;

}
