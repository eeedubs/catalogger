"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

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

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Register Page
app.get("/register", (req, res) => {

  res.render("register");
});

// Resources Page
app.get("/resources", (req, res) => {
  // include session id, user, pass info to template vars
  res.render("resources");
});

// Specified Category Page
app.get("/category/:id", (req, res) => {
  res.render("resources/:id");
});

// Categories Redirect
app.get("/category", (req, res) => {
  res.redirect("/");
});

// User Profile update page
app.get("/update", (req, res) => {
  res.redirect("info");
});

// Search???????

// Register new user
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Use knex integrations to access database
  res.redirect("/");
});

// Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  res.redirect("/");
});

// Logout
app.post("/logout", (req, res) => {
  res.redirect("/register");
});

// Submit Resource
app.post("/submit", (req, res) => {
  const resourceURL = req.body.urlLink;
  const title = req.body.title;
  const description = req.body.description;
  // Use knex integrations to access database
  res.render("/");
});

// Like Resource
app.post("/like", (req, res) => {
  res.render("/");
});

// Comment On Resource
app.post("/comment", (req, res) => {
  res.render("/");
});

// Categorise Resource
app.post("/like", (req, res) => {
  res.render("/");
});
