// server.js Handles all HTTP requests (server-side)
"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// renders the ./styles/.scss files to the /public/styles/layout.css file
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


// Register Page
app.get("/register", (req, res) => {
  res.render("register");
});


// Resources Page - ATTACHES A HIDDEN ID TAG TO THE RESOURCE
app.get("/resources", (req, res) => {
  // include session id, user, pass info to template vars
  if (req.cookies['username']){
    // if cookies are found
    knex('resources')
    .select('id')
    // select the id from resources, then pass that into the /resources
    .then((data)=>{
      console.log("Select query for Resources ", data);
      res.render("index", {id: data.id});
    });

  } else {
    res.redirect("/register");
  }
});


// Specified Category Page - ATTACHES A HIDDEN ID TAG TO THE CATEGORY
app.get("/category/:id", (req, res) => {
  if (req.cookies['username']){
    knex('categories')
    .select('id')
    .then((data)=> {
      console.log("Select query for categories", data);
      res.render("category", {id: data.id});
    });
  } else {
    res.redirect("/register");
  }
});

// Categories Redirect
app.get("/category", (req, res) => {
  if (req.cookies['username']){
    res.redirect("/");
  } else {
    res.redirect("/register");
  }
});

// User Profile update page
app.get("/info", (req, res) => {
  if (req.cookies['username']){
    res.render("info");
  } else {
    res.redirect("/register");
  }
});

// Search for resources page
app.get("/search", (req, res) => {
  let searchQuery = req.query.searchQuery;
  const username = req.cookies.username;
  if (username) {
    knex('users')
    .select('id')
    .where('name', username)
    .then((data) => {
      console.log(searchQuery);
      knex
        .select().from('resources')
        .where('title', 'LIKE', `%${searchQuery}%`)
        .orWhere('description', 'LIKE', `%${searchQuery}%`)
        .then ((results) => {
          res.render("search", results);
          console.log(results);
        });
      });
    } else {
      res.redirect("/register");
    }
  });

// Home page
app.get("/", (req, res) => {
  const username = req.cookies.username;
  if (username) {
    knex('users')
    .select('id')
    .where('name', username)
    .then((data) => {
      const templateVars = {
        id: data[0].id
      };
      res.render("index", templateVars);
    });
  } else {
    res.redirect("/register");
  }
});

/////////////////
///POST ROUTES///
/////////////////


// FOR ADDING NEW RESOURCES - WORKS √
app.post("/submit", (req, res) => {
  console.log('body', req.body);
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


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


  // function getAllResources(userId){
  //   return Promise.resolve([]);
  // }
  
  // function searchResources(userId, term){
  //   return Promise.resolve([]);
  // }

// app.get("/search", (req, res) => {
//   if (req.cookies['username']){
//     // if we don't have params, do a regular get and render everything
//     // if we do, perform a search and render the results
//     let query;
//     if(!req.query.q){
//       // if no query, load all resources
//       query = getAllResources(req.cookies['username']);
//     } else {
//       // else, load the resources for the user
//       query = searchResources(req.cookies['username'], req.query.q)
//     }
//     query
//     .then((results) => {
//       res.render("search", {results });
//     });
// } else {
//     res.redirect("/register");
//   }
// });


// app.post("/search", (req, res) => {
//   const username = req.cookies.username;
//   if (username) {
//     // const search = req.body.search;
//     res.render("search");
//   } else {
//     res.redirect("/register");
//   }
// })