// -*- coding: utf-8 -*-
//server.js
//----------------------------------
// Created By: Matthew Kastl
// Created Date: 1/15/2023
// version 1.0
//----------------------------------
// """This file is an express webserver
// that serves the public direcotry under root.
//  """ 
//----------------------------------
// 
//
//Imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); 
const APIHandler = require('./APIHandler.js')
const ORM = require('./ORM.js');
const cors = require('cors');

//Load in .env file.
dotenv.config();

//Construct a new webapp, this is our server
const app = express();

// Cross orgine handling
app.use(cors())

//Read in what port to use from the env
const port = process.env.PORT;

//Declare the dist directory as our static dir, and host it. Anything that hits
//the / endpoint will get the dist dir back
const publicPath = path.join(__dirname, '../Front');
app.use(express.static(publicPath));

const orm = new ORM();
orm.CreateDB();
const apiHandler = new APIHandler();

app.get('/api', (req, res) => {
  apiHandler.HandleGetRequest(req, (responseOBj) => {
    res.send(JSON.stringify(responseOBj));
  })
  
});

//Start are server on the port we selected.
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});