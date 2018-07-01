const mongoose = require('mongoose')
const Joi = require('joi')

// 1. Define schema for genres
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    trquired: true,
    minlength: 5,
    maxlength: 50
  }
})

// 2. Compile the schema into a model
const Genre = mongoose.model('Genre', genreSchema)

// Function to validate the incoming genre name. Joi library used to do the validation
const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().required().min(5).max(50)
  }

  return result = Joi.validate(genre, schema)
}

module.exports.Genre = Genre
module.exports.validateGenre = validateGenre