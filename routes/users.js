"use strict";

// users.js handles the inserting and retrieving of information from the database

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');

module.exports = (knex) => {

  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  //   })

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((results) => {
        res.json(results);
    });
  })

  router.get("/search", (req, res) => {
    const searchQuery = parseQuery(window.location.search);
    console.log(searchQuery);
    knex.select().from('resources')
      .where('title', 'LIKE', `%${searchQuery}%`)
      .orWhere('description', 'LIKE', `%${searchInput}%`)
      .asCallback(function(err, result){
          console.log("Searching...");
          if (err) {
              throw err;
          }
          console.log(`Found ${result.length} articles matching your search for '${command}':`);
          result.forEach(function(row) {
              console.log(`${row}`);
              res.json(row);
          })
      })
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

  // function idFinder(username) {
  //       console.log("!!!!!Kdlfn = ", username)
  //   knex('users')
  //   .select('id')
  //   .where('name', username)
  //   .then((results) => {
  //     return id;
  //   })
  // };


// SUBMIT A NEW POST ROUTE
  // router.post("/submit", (req, res) => {
  //   const title = req.body.title;
  //   const description = req.body.description;
  //   const resourceURL = req.body.resourceURL;
  //   const imageURL = req.body.imageURL;
  //   console.log("ok here")
  //   knex('resources')
  //     .insert({
  //       resourceURL: resourceURL,
  //       title: title,
  //       imageURL: imageURL,
  //       description: description,
  //     })
  //     .then((results) => {
  //       res.redirect("/")
  //     });
  // })

  // LOGOUT USER
    router.post("/logout", (req, res) => {
      res.clearCookie('username');
      res.redirect("/register");
    })

// COMMENT ROUTE

    //1. You firstly need to get the user_id which is like Cookie Session
    //2. You will get the comments from the user who type and pressed POST
    //3. Resource Id - You need to have resource id as a hidden tag in the page

  router.post("/comment", (req, res) => {

    id
    comment
    user_id
    resource_id

    const comment = req.body.comment;
    const user_id = req.body.user_id;
    const resource_id = req.body
      knex('user_likes')
      .insert({
        user_id: user_id,
        comment: comment
      })
      .then((results) => {
        res.redirect("/")
      });
  })

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
