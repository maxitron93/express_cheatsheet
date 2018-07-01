// 1. Need mongoose to connect to the database
const mongoose = require('mongoose')

// 2. Connect to the database called 'playground'. If 'playground' doesn't exist, it will be made automatically
mongoose.connect('mongodb://localhost/playground') 
.then(() => {
  console.log('Connected to MongoDB...')

  // Run createMovie (defined below) after the server is connected to the database
  createMovie();
  
  // Run getMovies (defined below) to query the database
  // getMovies();

  // Run updateMovie (defined below) to udpate a document
  // updateMovie("5b378b8fdd7b6e04a5a4b7a8");

  // Run deleteMovie (defined below) to delete a document
  // deleteMovie("5b378b8fdd7b6e04a5a4b7a8")

})
.catch((error) => {
  console.log('Could not connect to MongoDB', error)
})

// 3. We need a schema that defines the shape of movie documents in the mongoDB database 
const movieSchema = new mongoose.Schema({
  name: String,
  director: String,
  actors: [String],
  date: { type: Date, default: Date.now },
  isOnDvd: Boolean,
  dvdPrice: Number
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
    actors: ['Batman', 'Robbin', 'Joker'],
    // Don't need to asign date because there's a default value
    isOnDvd: true,
    dvdPrice: 2000
  })

  // 6. Save the movie into the database (it's an async function because it takes time to save the data into the database). A more complete list of Document methods can be found at http://mongoosejs.com/docs/api.html#Document
  const result = await movie.save()

  // MongoDB returns the entire document after it's saved
  console.log(result) 
}





/////////////////////////////////
///// QUERYING THE DATABASE /////
/////////////////////////////////

// An async function to query the database 
async function getMovies () {
  // Movie.find returns a Document Query object which is like a promise (it takes time to query the database)
  const movies = await Movie.find() // Find all the movies

  // Query methods can be chained. A more complete list of methods can be found at http://mongoosejs.com/docs/api.html#Query
  const chainedBatmanQuery = await Movie
    .find({ name: 'Batman Begins'}) // Return only movies where the name is 'Batman Begins'
    .limit(1) // Return only one movie
    .select({name: 1}) // Return only the name
  
  // A query with comparison operators (eq, ne, gt, gte, lt, lte, in, nin). A more complete list of comparison Query  methods can be found at http://mongoosejs.com/docs/api.html#Query
  const comparisonBatmanQuery = await Movie
    // .find( { dvdPprice: { $gte: 1000, $lte: 3000} } ) //Find movies where the dvdpPice is greater than or equal to 1000 and less than or equal to 3000
    .find( { dvdPrice: { $in: [1000, 2000, 3000] } } ) // Find movies where the dvdPrice is 1000, 2000 or 3000

  // A query with logical operators (or, and, nor). A more complete list of logical Query methods can be found at http://mongoosejs.com/docs/api.html#Query
  const logicalBatmanQuery = await Movie
    .find() // Find all the movies
    .or( [ { actors: ['Batman', 'Robbin', 'Joker'] }, { name: 'Batman Begins' } ] ) // Return movies where the actors are ['Batman', 'Robbin', 'Joker'] or the name is 'Batman Begins'

  // A query with regular expressions
  const regexBatmanQuery = await Movie
    // .find( { name: /^Bat/ } ) // Find movies where the name starts with "Bat"
    // .find( { name: /ins$/ } ) // Find movies where the name ends with "ins"
    .find( { name: /.*Begi.*/ } ) // Find movies where the name contains with "Begi"

  // A query to return the count of all movies. 
  const moviesCount = await Movie
    .find() // Find all the movies
    .count() // Return the count

  // A query to enable pagination (pagination enabled through backend logic)
  const pageNumber = 2
  const pageSize = 10 // Hardcoded here, but in real life these values would sent as part of a request: e.g api/movies?pageNumber=2pageSize=10
  const paginationBatmanQuery = await Movie
    .find() // Find all the movies
    .skip((pageNumber - 1) * pageSize) // Skip the first 10 movies (movies on the previous page) 
    .limit(pageSize) // Get the next 10 movies after skipping the first 10 movies
  
  // Console log the query results
  console.log("All Movies", movies)
  console.log("Chained Batman query", chainedBatmanQuery)
  console.log("Comparison Batman query", comparisonBatmanQuery)
  console.log("Logical Batman query", logicalBatmanQuery)
  console.log("Regex Batman query", regexBatmanQuery)
  console.log("Movies count:", moviesCount)
  console.log("Pagination Batman query", paginationBatmanQuery)
}





////////////////////////////////
///// UPDATING A DOCUMENT /////
////////////////////////////////

// An async function to update a document
async function updateMovie(id) {
  // First approach (Query first):
  // 1. findById()
  // 2. Modify its properties
  // 3. save()
  // Example:
  const movie = await Movie.findById(id) // 1. Find the movie by ID with a query to the database
  if (!movie) return; // If no movie found, end the function immediately
  movie.set({ // 2. Update the movie
    name: "The Avengers",
    dvdPrice: 4000
  })
  const result = await movie.save() // 3. Save the updates
  console.log(result) // Console log the updated movie


  // Second approach (Update directly):
  // 1. Update directly
  // 2. Optionally: get the updated document
  // Example: 
  const result2 = await Movie.update( { _id: id }, {
    $set: {
      name: "The Mask",
      dvdPrice: 2500
    }
  })
  // For more update operators, visit https://docs.mongodb.com/manual/reference/operator/update/ 
  console.log(result2)


  // Third approach (Update directly, but returns the updated document):
  // 1. Update directly
  // 2. Optionally: get the updated document
  const result3 = await Movie.findByIdAndUpdate(id, {
    $set: {
      name: "Batman Begins Again!",
      dvdPrice: 2000
    }
  }, { new: true }) // Returns the updated document(without new: true, the original document will be returned)
  // For more Model methods, visit http://mongoosejs.com/docs/api.html#Model
  console.log(result3)
}





////////////////////////////////
///// DELETING A DOCUMENT /////
////////////////////////////////

// An async function to delete a document
async function deleteMovie(id) {
  // Deleting one document
  const result = await Movie.deleteOne( { _id: id } ) // Delete the first document that satisfies the filter criteria. For more model methods visit: http://mongoosejs.com/docs/api.html#Model
  console.log(result) // Returns a result object that shows the number of documents that were deleted 


  // Deleting many documents
  const result2 = await Movie.deleteMany( { _id: id } ) // Delete all the documents that satisfy the filter criteria. For more model methods visit: http://mongoosejs.com/docs/api.html#Model
  console.log(result2) // Returns a result object that shows the number of documents that were deleted
  
  
  // Delete document by ID
  const result3 = await Movie.findByIdAndRemove(id) // Delete the movie with the given ID. For more model methods visit: http://mongoosejs.com/docs/api.html#Model
  console.log(result3) // Returns null if no ID
}