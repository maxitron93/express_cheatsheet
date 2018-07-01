const express = require('express')
const app = express()

///// EXPRESS METHODS (Including built-in middleware) /////
///// https://expressjs.com/en/4x/api.html#express /////
// This is a built-in middleware function in Express. It parses the body of the request and if there is a JSON object, it will populate req.body
app.use(express.json())
// This is a built-in middleware function in Express.It parses url request with url encoded payloads e.g. key=value&key=value (like how form data used to be sent in the past). It populates req.body (just like express.json()). 
app.use(express.urlencoded({extended: true}))



///// THIRD PARTY MIDDLEWARE MODULES /////
///// https://expressjs.com/en/resources/middleware.html /////
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const cors = require('cors')
app.use(cors())
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// Helmet helps you secure your Express apps by setting various HTTP headers. This is a widely used middleware module.
const helmet = require('helmet')
app.use(helmet())
// Everytime a reqest is sent to the server, it gets logged. This is a widely used middleware module.
const morgan = require('morgan')
app.use(morgan())



///// CUSTOM MIDDLEWARE MODULES /////
// Custom middlewear that logs to the console everytime a request is recieved (just console.log for now)
const logger = require('./reference_modules/logger')
app.use(logger)
// Custom middlewear that authenticates the request everytime a request is recieved (just console.log for now)
const authenticator = require ('./reference_modules/authenticator')
app.use(authenticator)