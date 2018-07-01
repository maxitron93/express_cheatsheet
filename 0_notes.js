const express = require('express')
const app = express()

// /api/customers is an example endpoint to work with customers. All operations to do with this resource gets sets to this endpoint
// GET - Getting Data. e.g. GET /api/customers to get customer data
// POST - Creating Data e.g. POST /api/customers to create customer data 
// PUT - Updating Data e.g. PUT /api/customers to update customer data
// DELETE - Delete Data. e.g. DELETE /api/customers to delete customer data

//app.get('/', (req, res) => {
  // For more information about req properties (req.body, req.cookies, etc) visit https://expressjs.com/en/4x/api.html#req.app
  // For more information about res properties (req.body, req.cookies, etc) visit https://expressjs.com/en/4x/api.html#res
//})

// Getting params from the URL
// http://localhost:3000/api/courses/1
app.get('/api/courses/:id', (req, res) => {
  res.send(req.params.id)
})

// Getting multiple parameters from the url
// http://localhost:3000/api/posts/2018/1
app.get('/api/posts/:year/:month', (req, res) => {
  // This will send back the params object
  res.send(req.params)
})

// Getting queries from the url
// http://localhost:3000/api/queries/2018/1?sortBy=name
app.get('/api/queries/:year/:month', (req, res) => {
  // This will send back the params object
  res.send(req.query)
})

// Variables that are assigned a non-primitive value are given a reference to that value. That reference points to the object’s location in memory. The variables don’t actually contain the value (non-primitive data types are arrays, functions and objects). For more information, visit https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0


console.log(process.env.NODE_ENV) // Gets the enviroment variable and returns 'undefined' if NODE_ENV is not explicitly set 
console.log(app.get('env')) // Gets the environment and returns 'development' if NODE_ENV is not explicitly set

