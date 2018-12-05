// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = (knex) => {

  // LOAD ALL RESOURCES FOR HOME PAGE
  router.get("/resources", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((results) => {
        // Prints each result to the terminal console
        results.forEach((result) => {
          console.log(JSON.stringify(result) + "\n");
        })
        // Sends the results in JSON format
        res.json(results);
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

// REGISTER NEW USER ROUTE
  router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    knex('users')
      .insert({
        name: username,
        password: password
      })
      .then((results) => {
        res.cookie("username", username).redirect("/");
      })
  });

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.cookie("username", username);
    res.redirect("/");
  })


  // LOGOUT USER
    router.post("/logout", (req, res) => {
      res.clearCookie('username');
      res.redirect("/register");
    })

  // Comment On Resource
  router.post("/comment", (req, res) => {
    const userComment = req.body.commentInput;
    const username = req.cookies.username
    // const resourceId = req.body.
    const userId = knex
      .select('user_id')
      .from('user_comments')
      .where('name', 'IS', username)
      .then((result) => {
        return result
      });
    console.log("user's id is: ", userId);
    knex('user_comments')
    .insert({
      comment: userComment,
      user_name: username,
      time_created: Date.now()
      // user_id: userId
    })
    .then((results) => {
      res.status(201).redirect("/");
    });
  })


// COMMENT ROUTE

    //1. You firstly need to get the user_id which is like Cookie Session
    //2. You will get the comments from the user who type and pressed POST
    //3. Resource Id - You need to have resource id as a hidden tag in the page

  // router.post("/comment", (req, res) => {
  //   // console.log("it's a comment!")
  //   const newComment = req.body.commentInput;
  //   console.log("new comment: ", newComment);
  //   const userId     = knex.select('id').from('users').where('name', '=', `%${req.cookies.username}%`);
  //   console.log("user's ID: ", userId);
  //   const resourceId = req.body.resourceId;
  //   // const resourceId = knex.select('id').from('resources').where('title', 'LIKE', `%${resourceByName}%`);
  //   console.log("resource ID: ", resourceId);
  //   knex('user_comments')
  //     .insert({
  //       user_id: userId,
  //       comment: newComment,
  //       resource_id: resourceId
  //     })
  //     .then((results) => {
  //       res.json(results);
  //     });
  // })

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
