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

  router.get('/:categoryName', (req, res) => {
    let catName   = req.params.categoryName;
    let sessionID = req.session.user_id;
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = results[0].id;
        knexQueries.getCategoryIDByName(catName, userID, (error, catIDResults) => {
          if (error) {
            console.log('error', error.message);
            res.status(500).json({ error: error.message });
          } else {
            let catID = catIDResults[0].id;
            knexQueries.getAllResourcesMatchingCategoryID(catID, userID, (error, resourceResults) => {
              if (error) {
                console.log('error', error.message);
                res.status(500).json({ error: error.message });
              } else {
                res.json(resourceResults)
              }
            })
          }
        })
      }
    })
  })

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
    let resourceID = Number(req.body.resourceID);
    let categoryID = Number(req.body.categoryID);
    let sessionID = req.session.user_id;
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
    let resourceURL         = req.body.resourceURL;
    let resourceTitle       = req.body.title;
    let resourceDescription = req.body.description;
    let resourceImage       = req.body.imageURL;
    let sessionID           = req.session.user_id;
    if (sessionID){
      knexQueries.getUserBySessionID(sessionID, (error, results) => {
        if (error) {
          console.log('error', error.message)
          res.status(500).json({ error: error.message });
        } else {
          let userID = results[0].id;
          knexQueries.postResource(resourceURL, resourceTitle, resourceImage, resourceDescription, userID, (error, results) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.redirect("/");
            }
          })
        }
      })
    } else {
      res.redirect("/register");
    }
  })

  return router;
}