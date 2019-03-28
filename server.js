// server.js Handles all HTTP requests (server-side)
"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
let environment     = process.env.NODE_ENV || "production";
if (PORT === 8080){
  environment = process.env.ENV || "development";
}
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
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
const knex        = require('knex')(knexConfig[environment]);
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

// Register Page
app.get("/register", (req, res) => {
  res.render("register");
});

// Search for resources page
app.get("/search", (req, res) => {
  let searchQuery = req.query["query"];
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: `Search results for "${searchQuery}":`,
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render('resource-page', templateVars);
          }
        })
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get("/resources", (req, res) => {
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: "Resources you've liked or posted:",
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render('resource-page', templateVars);
          }
        })
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get("/liked-resources", (req, res) => {
  let sessionID = req.session.user_id;
  if (sessionID) {
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: "Resources you've liked:",
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render('resource-page', templateVars);
          }
        })
      }
    })
  } else {
    res.redirect('/register');
  }
});

app.get('/categories', (req, res) => {
  let sessionID = req.session.user_id;
  let categoryName = req.query['name'];
  console.log(categoryName);
  if (sessionID){
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: categoryName,
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render("resource-page", templateVars);
          }
        })
      }
    })
  } else {
    res.redirect("/register");
  }
})

// User Profile update page
app.get("/account", (req, res) => {
  let sessionID = req.session.user_id;
  let query = req.query['page']
  if (sessionID){
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error){
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: (query === "info") ? "Account Information" : "Category Information",
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render("info", templateVars);
          }
        })
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
    knexQueries.getUserBySessionID(sessionID, (error, userResults) => {
      if (error) {
        console.log('error', error.message)
        res.status(500).json({ error: error.message });
      } else {
        knexQueries.getCategoriesByUserID(userResults[0].id, (error, categoryResults) => {
          if (error) {
            console.log('error', error.message)
            res.status(500).json({ error: error.message });
          } else {
            let templateVars = {
              user: userResults[0],
              pagename: "Home",
              categories: categoryResults
            }
            userResults, categoryResults = null;
            res.render('index', templateVars);
          }
        })
      }
    })
  } else {
    res.redirect('/register');
  }
});
                
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});