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

  // router.post("/categorize", (req, res) => {
  //   const resourceId = req.body.resourceID;
  //   const categoryNum = req.body.categoryID;
  //   const sessionId = req.session.user_id;
  //   knex.getUserBySessionID(sessionID, (error, results) => {
  //     if (error){
  //       console.log('error', error.message)
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       let userID = results[0].id;


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