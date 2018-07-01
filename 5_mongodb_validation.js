// 1. Need mongoose to connect to the database
const mongoose = require('mongoose')

// 2. Connect to the database called 'validatedPlayground'. If 'validatedPlayground' doesn't exist, it will be made automatically
mongoose.connect('mongodb://localhost/validatedPlayground') 
.then(() => {
  console.log('Connected to MongoDB...')

  // Run createMovie (defined below) after the server is connected to the database
  createMovie()
})
.catch((error) => {
  console.log('Could not connect to MongoDB', error)
})



/////////////////////////////////////////
///// VALIDATION DONE IN THE SCHEMA /////
////////////////////////////////////////
// This is NOT validation at the database level. Validation is done by mongoose when a document is being saved. Apparently mongoDB doesn't support database level validation - i.e. after a document is saved in the database, you can go to MongoDB Compas and change the document manually and mongoDB won't care because it won't try to validate the changes.

// 3. We need a schema that defines the shape of movie documents in the mongoDB database. This schema has various built-in mongoose, and custom, validators. For more information on built-in validators, visit: http://mongoosejs.com/docs/validation.html 
const movieSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true // (built-in validator) 
  }, // all movies need a name to be saved.  
  
  director: {
    type: String,
    minLength: 5, // (built-in validator) needs to have min of 5 characters
    maxlength: 255,  // (built-in validator) number of characters cannot exceed 255 characters
    
    lowercase: true, // Not a validator, but a useful property. This converts the input into lowercase. For more schema properties, visit http://mongoosejs.com/docs/schematypes.html
    trim: true // Not a validator, but a useful property. This removes any spaces around the string.
  },
  
  genre: {
    type: String,
    required: true, // (built-in validator)
    enum: [ 'Horror', 'Romance', 'Action', 'Thriller' ] // (built-in validator) genre must be one of the genres defined in the array
  },

  actors: {
    type: Array,
    validate: { // (custom validator) array needs to have at least 2 actors
      validator: function(value) { // validation logic inside a function
        return value && value.length >= 2 // return true if the array exists and the length is greater than or equal to 2
      },
      message: 'A movie needs to have at least 2 actors' // return this message if the validation fails
    }
  },
 
  date: { type: Date, default: Date.now },
  
  isOnDvd: Boolean,
  
  dvdPrice: {
    type: Number,
    required: function() { return this.isOnDvd }, // (built-in validator) dvdPrice is only required if isOnDvd is true. Arrow function cannot be used here because 'this' will be undefined.

    set: (value) => { 
      return Math.round(value)
    }, // Not a validator, but a useful property. set is called when trying to save the document. In this case, it will round dvdPrice to the nearest integer before saving. For more schema properties, visit http://mongoosejs.com/docs/schematypes.html
    get: (value) => { 
      return Math.round(value)
    }, // Not a validator, but a useful property. get is called when trying to access the document. In this case, it will round dvdPrice to the nearest integer before providing the saved value. This is useful if there are dvdPrices in the database that are not rounded to the nearest integer (e.g. if documents were saved before the set property was created). For more schema properties, visit http://mongoosejs.com/docs/schematypes.html
  }
})

// 4. We need to compile the schema into a model (which is a JS class)
const Movie = mongoose.model('Movie', movieSchema)



//////////////////////////////
///// SAVING TO DATABASE /////
//////////////////////////////

// An async function to save a movie into the database (function executed above)
async function createMovie() {
  // 5. We can create an object based on the model (which is a JS class)
  const movie = new Movie({
    name: 'Batman Begins',
    director: 'Michael Bay',
    genre: "Horror",
    actors: ['Batman', 'Robbin', 'Joker'],
    // Don't need to asign date because there's a default value
    isOnDvd: true,
    dvdPrice: 2600.7
  })

  // 6. Save the movie into the database. Need a try-catch block here to handle situations where the movie being saved doesn't meet the validation requirements. Validation kicks in when we try to save the movie onto the database.
  try {
    const result = await movie.save()
    // MongoDB returns the entire document after it's saved
    console.log(result) 

  } catch (validationErrors) {
    
    // Console log the entire validation error object
    console.log(validationErrors)
    
    // Console log each individual error inside the validation error object  
    for (field in validationErrors.errors) {
      console.log(validationErrors.errors[field])
    }

    // Console log each individual error message inside the validation error object  
    for (field in validationErrors.errors) {
      console.log(validationErrors.errors[field].message)
    }
  }

}