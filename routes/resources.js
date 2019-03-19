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

module.exports = (knex) => {
  
  const knexQueries = require('../lib/knex-queries')(knex);

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
    const resourceID = Number(req.body.resourceID);
    const categoryID = Number(req.body.categoryID);
    const sessionID = req.session.user_id;
    console.log(resourceID)
    console.log(categoryID)
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.checkCategorization(userID, resourceID, categoryID, (error, results) => {
          if (error){
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            if (results[0]){
              res.json({
                success: false,
                error: "The selected resource already belongs to that category."
              })
            } else {
              knexQueries.categorizeResource(userID, resourceID, categoryID, (error, results) => {
                if (error){
                  console.log('error', error.message)
                  res.status(500).json({ error: error.message });
                } else {
                  res.status(200).json({
                    success: true,
                    error: null
                  })
                }
              })
            }
          }
        })
      }
    })
  })


  // FOR ADDING NEW RESOURCES - WORKS √
  router.post("/", (req, res) => {
    const resourceURL = req.body.resourceURL;
    const resourceTitle       = req.body.title;
    const resourceDescription = req.body.description;
    const resourceImage    = req.body.imageURL;
    const userID      = req.body.user.id;
    console.log("userID: ", userID);
    knexQueries.postResource(resourceURL, resourceTitle, resourceImage, resourceDescription, userID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.redirect("/");
      }
    })
  })

  return router;
}