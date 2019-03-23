// server.js Handles all HTTP requests (server-side)
"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const uuidv1        = require('uuid/v1');
const cookieParser  = require('cookie-parser');

app.use(cookieParser());

// Cookies only last for 30 minutes
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ["userID"],
  maxAge: 30 * 60 * 1000
}));

// Setting up Knex with PostgreSQL
// knexConfig[ENV] is set to use the production environment (const ENV = 'Production')
// knexQueries contains all of the Knex queries to the PSQL database
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const knexQueries = require('./lib/knex-queries')(knex);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes
const userRoutes      = require("./routes/users");
const resourceRoutes  = require("./routes/resources");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// renders the ./styles/.scss files to the /public/styles/layout.css file
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all routes
app.use("/api/users", userRoutes(knex));
app.use("/api/resources", resourceRoutes(knex));

// // Resources Page - ATTACHES A HIDDEN ID TAG TO THE RESOURCE
// app.get("/resources", (req, res) => {
//   // include session id, user, pass info to template vars
//   if (req.cookies['username']){
//     // if cookies are found
//     knex('resources')
//     .select('id')
//     // select the id from resources, then pass that into the /resources
//     .then((data)=>{
//       console.log("Select query for Resources ", data);
//       res.render("index", {id: data.id});
//     });

//   } else {
//     res.redirect("/register");
//   }
// });

// Register Page
app.get("/register", (req, res) => {
  res.render("register");
});

// Search for resources page
app.get("/search", (req, res) => {
  let searchQuery = req.query["query"];
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = {
          user: results[0],
          pagename: `Search Results For "${searchQuery}"`
        }
        res.render('resource-page', templateVars);
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get("/:username/resources", (req, res) => {
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = {
          user: results[0],
          pagename: "Your Resources"
        }
        res.render('resource-page', templateVars);
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get("/:username/liked-resources", (req, res) => {
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = {
          user: results[0],
          pagename: "Resources You've Liked"
        }
        res.render('resource-page', templateVars);
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get('/:username/categories', (req, res) => {
  let sessionID = req.session.user_id;
  let categoryName = req.query['name'];
  console.log(categoryName);
  if (sessionID){
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = { 
          user: results[0],
          pagename: categoryName
        }
        res.render("resource-page", templateVars);
      }
    })
  } else {
    res.redirect("/register");
  }
})

// User Profile update page
app.get("/:username", (req, res) => {
  const sessionID = req.session.user_id;
  if (sessionID){
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = {
          user: results[0],
          pagename: "Info"
        }
        res.render("info", templateVars);
      }
    })
  } else {
    res.redirect("/register");
  }
})

// Home page
app.get("/", (req, res) => {
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, results) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        let templateVars = {
          user: results[0]
        }
        res.render('index', templateVars);
      }
    })
  } else {
    res.redirect('/register');
  }
});
                
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});