// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const uuidv1 = require('uuid/v1');


module.exports = (knex) => {

  // LOAD ALL RESOURCES FOR HOME PAGE
  router.get("/resources", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((resources) => {
        // Prints each result to the terminal console
        resources.forEach((resource) => {
          // console.log(JSON.stringify(resource) + "\n");
        })
        // Sends the resources in JSON format
        res.json(resources);
      })
    })

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
    const username = req.body.username;
    const password = req.body.password;
    // const randomInt = "user" + Math.random().toString(36).substring(2, 10);
    const uniqueId = uuidv1();
    console.log(`Name: ${username}, Password: ${password}`);
    knex('users')
    .select('*')
    .where('name', '=', username)
    .then((results) => {
      console.log(`results = ${results}`);
      if (results[0]){
        res.redirect(400, '/register');
      } else {
        return knex('users')
        .insert({
          // id: randomInt,
          name: username,
          password: password,
          cookie_session: uniqueId
        })
        .then(() => {
          req.session.user_id = uniqueId;
          res.redirect('/');
        })
      }
    })
  });

  // LOGIN HELPER FUNCTION
  function loginKnex (username, password){
    return knex('users')
    .select('*')
    .where('name', '=', username)
    .then((exists) => {
      if (exists[0]){
        if (exists[0].password === password){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    })
  }

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const uniqueId = uuidv1();
    console.log(loginKnex(username, password));
    knex('users')
    .select('*')
    .where('name', '=', username)
    .then((exists) => {
      if (exists[0]){
        if (exists[0].password === password){
          return knex('users')
          .update('cookie_session', uniqueId)
          .where('name', '=', username)
          .then(() => {
            req.session.user_id = uniqueId;
            res.redirect('/');
          })
        } else {
          res.redirect(400, '/register');
        }
      } else {
        res.redirect(400, '/register');
      }
    })
  })

  //   knex('users')
  //   .select('*')
  //   .where('name', '=', username)
  //   .then((exists) => {
  //     console.log(exists);
  //     if (exists[0]){
  //       if (exists[0].password === password){
  //         return knex('users')
  //         res.session.user_id = uniqueId;
  //         res.redirect("/");
  //       } else {
  //         res.redirect(400, '/register');
  //       }
  //     } else {
  //       res.redirect(400, '/register');
  //     }
  //   })
  // })


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
