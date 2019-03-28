"use strict";

const express       = require('express');
const router        = express.Router();
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

module.exports = (knex) => {
  
  const knexQueries = require('../lib/knex-queries')(knex);

  router.get('/comments', (req, res) => {
    knexQueries.getAllComments((error, commentResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(commentResults);
      }
    })
  })

  router.get("/likes", (req, res) => {
    knexQueries.getLikes((error, likeResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(likeResults);
      }
    })
  })

  router.get("/ratings", (req, res) => {
    knexQueries.getRatings((error, ratingResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(ratingResults);
      }
    })
  })

  router.get('/search', (req, res) => {
    let sessionID = req.session.user_id;
    let searchQuery = req.query['query'].toLowerCase();
    knexQueries.getResourcesBySearchQuery(searchQuery, (error, resourceResults) => {
      if (error) {
        console.log('error', error.message);
        res.status(500).json({ error: error.message });
      } else {
        res.json(resourceResults);
      }
    })
  })

  router.get('/categories', (req, res) => {
    let sessionID = req.session.user_id;
    let catName = req.query['catName'];
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let userID = userResults[0].id;
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
    knexQueries.getAllResources((error, resourceResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.json(resourceResults);
      }
    })
  })

  router.post("/like", (req, res) => {
    let userID      = Number(req.body.user_id);
    let resourceID  = Number(req.body.resource_id);
    knexQueries.checkIfLiked(userID, resourceID, (error, checkedLikeResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        if (checkedLikeResults[0]){
          knexQueries.deleteLike(userID, resourceID, (error, deleteLikeResults) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.json(deleteLikeResults);
            }
          })
        } else {
          knexQueries.postLike(userID, resourceID, (error, postLikeResults) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.json(postLikeResults);
            }
          })
        }
      }
    })
  })

  router.post("/rate", (req, res) => {
    let resourceRating  = Number(req.body.rating); 
    let userID          = Number(req.body.user_id);
    let resourceID      = Number(req.body.resource_id);
    knexQueries.checkIfRated(userID, resourceID, (error, checkRateResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        if (checkRateResults[0]){
          knexQueries.updateRating(resourceRating, userID, resourceID, (error, updatedRateResults) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.json({
                update: true,
                results: updatedRateResults
              })
            }
          })
        } else {
          knexQueries.postRating(resourceRating, userID, resourceID, (error, postRateResults) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.json({
                update: false,
                results: postRateResults
              })
            }
          })
        }
      }
    })
  })

  router.post("/categorize", (req, res) => {
    let userID      = Number(req.body.user_id);
    let resourceID  = Number(req.body.resource_id);
    let categoryID  = Number(req.body.category_id);
    knexQueries.checkCategorization(userID, resourceID, categoryID, (error, checkResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        if (checkResults[0]){
          res.json({
            error: "The selected resource already belongs to that category.",
            success: false
          })
        } else {
          knexQueries.categorizeResource(userID, resourceID, categoryID, (error, categorizeResults) => {
            if (error){
              console.log('error', error.message)
              res.status(500).json({ error: error.message });
            } else {
              res.status(200).json({
                error: null,
                success: true
              })
            }
          })
        }
      }
    })
  })


  // FOR ADDING NEW RESOURCES - WORKS √
  router.post("/", (req, res) => {
    let { resourceURL, resourceTitle, resourceImage, resourceDescription }  = req.body;
    let sessionID = req.session.user_id;
    if (sessionID){
      knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
        if (error) {
          console.log('error', error.message)
          res.status(500).json({ error: error.message });
        } else {
          let userID = userResults[0].id;
          knexQueries.postResource(resourceURL, resourceTitle, resourceImage, resourceDescription, userID, (error, resourceResults) => {
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

  router.post("/decategorize", (req, res) => {
    let userID      = req.body.user_id;
    let resourceID  = req.body.resource_id;
    let catID       = req.body.category_id;
    knexQueries.removeFromCategory(userID, resourceID, catID, (error, categoryResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(categoryResults);
      }
    })
  })

  router.post("/delete", (req, res) => {
    let resourceID = req.body.resource_id;
    knexQueries.deleteResource(resourceID, (error, deleteResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(deleteResults);
      }
    })
  })

  return router;
}