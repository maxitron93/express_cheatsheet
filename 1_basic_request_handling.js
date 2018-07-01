const express = require('express')
const app = express()
const Joi = require('joi')

// Use middleware to enable the parsing of JSON
app.use(express.json())

// Array used instead of a database
const genres = [
  {
    id: 1,
    name: "Horror"
  },
  {
    id: 2,
    name: "Comedy"
  },
  {
    id: 3,
    name: "Thriller"
  },
  {
    id: 4,
    name: "Action"
  },
  {
    id: 5,
    name: "Romance"
  }
]

// Function to validate the incoming genre name. Joi library used to do the validation
const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return result = Joi.validate(genre, schema)
}



/////////////////////////////////
///// HANDLING GET REQUESTS /////
/////////////////////////////////

// Request: All the genres
// Operation: None
// Response: All the genres
app.get('/movies/genres', (req, res) => {
  res.send(genres)
})

// Request: A specific genre by id
// Operation: None
// Response: The genre
app.get('/movies/genres/:id', (req, res) => {
  // 1. Look up the genre
  const genre = genres.find((current) => {
    return (parseInt(req.params.id) === current.id)
  })
  
  // 2. If it doesn't exist, send back 404
  if (!genre) {
    return res.status(404).send('The genre you requested does not exist')
  }

  // 3. If it exists, send back the genre name
  else {
    return res.send(genre)
  }
})



//////////////////////////////////
///// HANDLING POST REQUESTS /////
//////////////////////////////////

// Request: Create a new genre
// Operation: Create a new genre in the array
// Response: The newly created genre
app.post('/movies/genres', (req, res) => {
  // 1. Check if the genre name passes the validation
  const { error, value } = validateGenre(req.body)

  // 2. If it doesn't pass, send back 400 (bad request)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // 3. Check if the genre name already exists and send back 400 (bad request) if it exists
  if (genres.find((current) => current.name === value.name)) {
    return res.status(400).send('That genre already exists')
  }

  // 4. If it doesn't exists, push the new genre into the array and send back the newly created genre
  else {
    const newGenre = {
      id: genres.length + 1,
      name: value.name
    }

    genres.push(newGenre)

    return res.send(newGenre)
  }
})



/////////////////////////////////
///// HANDLING PUT REQUESTS /////
/////////////////////////////////

// Request: Update an existing genre by ID
// Operation: Update the genre name in the array
// Response: The updated genre
app.put('/movies/genres/:id', (req, res) => {
  // 1. Look for the genre by ID
  const genre = genres.find((current) => current.id === parseInt(req.params.id))

  // 2. If not found, send back 404 (resource not found)
  if (!genre) {
    return res.status(404).send('The genre you\'re looking for doesn\'t exist')
  }
  // 3. If found, validate the proposed name
  const { error, value } = validateGenre(req.body)
  
  // 4. If not valid, send back 400 (bad response)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  
  // 4. If valid, check if the proposed name already exists and send back 404 if it already exists
  if (genres.find((current) => current.name === value.name)) {
    return res.status(400).send('That genre already exists')
  }
  // 5. If it doesn't already exists, update the genre and send back the updated genre
  else {
    genre.name = value.name

    return res.send(genres)
  }
})



///////////////////////////////////
///// HANDLING DELETE REQUESTS /////
///////////////////////////////////

// Request: Delete an existing genre by ID
// Operation: Delete the genre from the array
// Response: The deleted genre
app.delete('/movies/genres/:id', (req, res) => {
  // 1. Look for the genre by ID
  const genre = genres.find((current) => parseInt(req.params.id) === current.id)

  // 2. If it doesn't exist, send back 404 (resource not found)
  if (!genre) {
    return res.status(404).send('The genre you\'re looking for doesn\'t exist')
  }

  // 3. If it exists, delete the genre from the array
  const index = genres.indexOf(genre)
  genres.splice(index, 1)

  // 4. Send back the deleted genre
  res.send(genre)
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})