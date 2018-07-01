//////////////////////////////////////////////////////////
///// ROUTE AND DATABASE SETUP FOR LOGGING IN USERS /////
//////////////////////////////////////////////////////////

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Joi = require('joi')
// bcrypt used to hash passwords
const bcrypt = require('bcrypt')
// jsonwebtoken used to create json web tokens
const jwt = require('jsonwebtoken')
// Import User model from models/User
const { User } = require('./models/User')

// 1. Connect to the database
mongoose.connect('mongodb://localhost/usersDatabase')
  .then(() => {
    console.log('Conencted to MongoDB...')

    // After connection is successful, start the app and listen on port 3000
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}`)
    })
  })
  .catch(() => console.log('Could not connect to MongoDB...'))

// Function to validate the incoming user details. Joi library used to do the validation
const validateUser = (user) => {
  const schema = {
    email: Joi.string().required().email().min(2).max(255),
    password: Joi.string().required().min(8).max(1024)
  }

  return result = Joi.validate(user, schema)
}

// 2. Add middleware needed to parse incoming requests
app.use(express.json())

// 3. Create route handlers
//////////////////////////
///// ROUTE HANDLERS /////
//////////////////////////

// Request: Login the user
// Operation: Check the details given against the details in the database
// Response: The user details
app.post('/api/auth', async (req, res) => {
  // 1. Valitade the incoming request
  const { error, value } = validateUser(req.body)

  // 2. If not valid, return 400 (bad request)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // 3. If valid, check for the email in the database. The User model used here is imported from models/User
  let user = await User.findOne( {email : value.email })
  
  // 4. If not found, send back 400 (bad request)
  if (!user) {
    return res.status(400).send('Invalid username or password')
  }

  // 5. If found, compare the given password with the password stored in the database
  const isValidPassword = await bcrypt.compare(value.password, user.password)

  // 6. If not valid, send back 400 (bad request)
  if (!isValidPassword) {
    return res.status(400).send('Invalid username or password')
  }

  // 7. If valid, create a web token. The first argument is the PUBLIC payload, the second argument is the private key. The private key should be stored in an environment variable, not hard-coded like below
  const token = jwt.sign({ _id: user._id}, 'Private Key')
  
  // 8. Send back the token in the header and the user id in the body
  return res.header('x-auth-token', token).send({ _id: user.id })
})