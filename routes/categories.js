"use strict";

// api/categories
const express       = require('express');
const router        = express.Router();
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt        = require ("bcrypt");
const uuidv1        = require('uuid/v1');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

module.exports = (knex) => {
  
  const knexQueries   = require('../lib/knex-queries')(knex);

  router.get("/", (req, res) => {
    let sessionID = req.session.user_id;
    let categoryNumber = req.query.number;
    console.log(categoryNumber);
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.getArrayOfResourceIDsFromCategory(userID, categoryNumber, (error, resultingArray) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            knexQueries.getAllResourcesFromArrayOfResourceIDs(resultingArray, (error, resultingResources) => {
              if (error) {
                console.log('error', error.message)
                res.status(500).json({ error: error.message });
              } else {
                res.json(resultingResources)
              }
            })
          }
        })
      }
    })
  })

  

  return router;
}