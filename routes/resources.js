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

  // LOAD ALL RESOURCES FOR HOME PAGE
  router.get('/', (req, res) => {
    knexQueries.getAllResources((error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    })
  })

  router.post("/categorize", (req, res) => {
    const resourceId = req.body.resourceID;
    const categoryNum = req.body.categoryID;
    const sessionId = req.session.user_id;
    knex('users')
    .select('*')
    .where('cookie_session', '=', sessionId)
    .limit(1)
    .then((result) => {
      let userId = result[0].id;
      return knex('category_resources')
        .insert({
          resource_id: resourceId,
          category_number: categoryNum,
          user_id: userId
        })
        .then(() => {
          res.status(201).json({success: true});
        })
    })
  })

  // FOR ADDING NEW RESOURCES - WORKS √
  router.post("/", (req, res) => {
    // console.log('body', req.body);
    const title = req.body.title;
    const description = req.body.description;
    const resourceURL = req.body.resourceURL;
    const imageURL = req.body.imageURL;
    const user_id = req.body.user_id;
    console.log("user_id = ", user_id);
    knex('resources')
      .insert({
        resourceURL: resourceURL,
        title: title,
        imageURL: imageURL,
        description: description,
        created_by: user_id
      })
      .then((results) => {
        res.redirect("/");
      });
  })

}