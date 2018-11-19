// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');

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

  // function getQuery() {
  //   document.querySelector('form').addEventListener('submit', (event) => {
  //     event.preventDefault();
  //     let $searchInput = $(`form#search-form .search-field`)[0].value;
  //      console.log($searchInput);
  //   });
  // }
  // getQuery();

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

// COMMENT ROUTE

    //1. You firstly need to get the user_id which is like Cookie Session
    //2. You will get the comments from the user who type and pressed POST
    //3. Resource Id - You need to have resource id as a hidden tag in the page

  router.post("/comment", (req, res) => {
    console.log("it's a comment!")
    const comment     = req.body.comment;
    const user_id     = req.body.user_id;
    const resource_id = req.body
      knex('user_comments')
      .insert
      ({
        comment:     comment,
        user_id:     user_id
        //resource_id:
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
