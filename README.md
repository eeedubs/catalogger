# Catalogger Project

Catalogger is a Pinterest replica which allows users to post and interact with news articles (resources). The application is built with HTML, SCSS, Bootstrap, jQuery and AJAX on the front-end, and Node, Express and Postgres on the back-end. 

## Getting Started

1. You will need a postgres database to run the server. Create a database called 'catalogger'
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Update the .env file with your correct local information
  - For example: ```
    DATABASE_HOST=localhost
    DATABASE_USER=username
    DATABASE_PASS=password
    DATABASE_NAME=catalogger
    DATABASE_PORT=5432
  ```
4. Install dependencies: `npm i`
5. Rebuild sass: `npm rebuild node-sass`
6. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
7. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- Bcrypt
- Body-parser
- Dotenv
- Express
- Node.js
- Postgres
- Node-sass
- Knex.js
- PG
- UUID

## Heroku Server

- This application is served at http://eeedubs-catalogger.herokuapp.com/