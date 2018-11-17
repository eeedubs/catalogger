"use strict";

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

// REGISTER NEW USER ROUTE
  router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.cookie("username", username);
    knex('users')
      .insert({
        name: username,
        password: password
      })
      .then((results) => {
        res.redirect("/")
      })
  });

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.cookie("username", username);
    res.redirect("/");
  })

// SUBMIT A NEW POST ROUTE
  router.post("/submit", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const resourceURL = req.body.resourceURL;
    const imageURL = req.body.imageURL;
    knex('resources')
      .insert({
        resourceURL: resourceURL,
        title: title,
        imageURL: imageURL,
        description: description,
      })
      .then((results) => {
        res.redirect("/")
      });
  })

  // LOGOUT USER
    router.post("/logout", (req, res) => {
      res.clearCookie('username');
      res.redirect("/register");
    })

// COMMENT ROUTE
  // router.post("comment", (req, res) => {

    //1. You firstly need to get the user_id which is like Cookie Session
    //2. You will get the comments from the user who type and pressed POST
    //3. Resource Id - You need to have resource id as a hidden tag in the page

  //   const comment = req.body.comment;
  //   knex.select('id').from('users').as('user_id').then()
  //     .insert({
  //       user_id: user_id,
  //       comment: comment
  //     })
  //     .then((results) => {
  //       res.redirect("/")
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
