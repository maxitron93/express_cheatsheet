//////////////////////////////////////////////////////////
///// ROUTE AND DATABASE SETUP FOR REGISTERING USERS /////
//////////////////////////////////////////////////////////

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Joi = require('joi')
// lodash gives us a lot of utility methods for working with arrays and objects. Apparently the convention is to use _ as the variable name
const _ = require('lodash')
// bcrypt used to hash passwords
const bcrypt = require('bcrypt')
// jsonwebtoken used to create json web tokens
const jwt = require('jsonwebtoken')


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



// 2. Define schema for Users with validation for each property
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  }
})

// 3. Compile the schema into a model
const User = mongoose.model('User', userSchema)

// Function to validate the incoming user details. Joi library used to do the validation
const validateUser = (user) => {
  const schema = {
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().required().email().min(2).max(255),
    password: Joi.string().required().min(8).max(1024)
  }

  return result = Joi.validate(user, schema)
}

// 4. Add middleware needed to parse incoming requests
app.use(express.json())

// 5. Create route handlers
//////////////////////////
///// ROUTE HANDLERS /////
//////////////////////////

// Request: Register the user
// Operation: Add the user to the database
// Response: The user details
app.post('/api/users', async (req, res) => {
  // 1. Valitade the incoming request
  const { error, value } = validateUser(req.body)

  // 2. If not valid, return 400 (bad request)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // 3. If valid, check if the email has already been used
  let user = await User.findOne( {email : value.email })
  
  // 4. If already used, send back 400 (bad request)
  if (user) {
    return res.status(400).send('That email has already been registered')
  }

  // 5. If not already used, create the user object
  user = new User({
    name: value.name,
    email: value.email,
    password: value.password 
  })

  // 6. Generate the salt
  const salt = await bcrypt.genSalt(10)
  
  // 7. Set user.password as the hashed password 
  user.password = await bcrypt.hash(user.password, salt)

  
  try {
    // 8. Save the user object to the database
    result = await user.save()

    // 9. (Optional) Create a web token. By sending back a json web token, the user is logged in as soon as he signs up. The first argument is the PUBLIC payload, the second argument is the private key. The private key should be stored in an environment variable, not hard-coded like below
    const token = jwt.sign({ _id: user._id}, 'Private Key')

    // 10. Send back the token in the header and user details in the body (using lodash to extract the name and email from the result object so the other details (password, id) aren't sent back)
    return res.header('x-auth-token', token).send(_.pick(result, ['name', 'email']))
  
  } catch (error) {
    // 11. If error, send back the error
    return res.status(400).send(error)
  }
})