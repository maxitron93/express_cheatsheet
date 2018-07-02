const mongoose = require('mongoose')
// jsonwebtoken used to create json web tokens
const jwt = require('jsonwebtoken')

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

// This is how to add methods to user instances. It's like adding instance methoods inside a class definition. The function below CANNOT be an arrow function because 'this' needs to reference the user instance. The purpose of this method is to store the function of gerenating a token in one place. Therefore, if we want to change the payload in the future, we only have to do it here instead of multiple places where it's written (registration, login, requesting data, etc). For more information on why this function should live inside the User model, look up the Information Expert Principle
userSchema.methods.generateAuthToken = function() {
  // The first argument is the PUBLIC payload, the second argument is the private key. The private key should be stored in an environment variable, not hard-coded like below.
  const token = jwt.sign({ _id: this._id}, 'Private Key')
  return token
}

const User = mongoose.model('User', userSchema)

module.exports.User = User