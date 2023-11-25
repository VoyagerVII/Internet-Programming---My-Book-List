const dotenv = require('dotenv');
const ORM = require('./ORM.js');

//Load in .env file.
dotenv.config();

// Create the DB
const orm = new ORM();
orm.CreateDB();