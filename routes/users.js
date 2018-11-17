"use strict";

const express = require('express');
const router  = express.Router();

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
    knex('users')
      .insert({
        name: username,
        password: password
      })
      .then((results) => {
        res.redirect("/")
      })
  });

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

// COMMENT ROUTE
  // router.post("comment", (req, res) => {
  //   const comment = req.body.comment;
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
