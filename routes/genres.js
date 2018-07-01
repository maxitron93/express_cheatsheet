const express = require('express')
const router = express.Router()
const { Genre, validateGenre } = require('../models/Genre')

//////////////////////////
///// ROUTE HANDLERS /////
//////////////////////////

// Request: All the genres
// Operation: None
// Response: All the genres
router.get('/', async (req, res) => {
  // 1. Get the genres from the database and sort by name
  const genres = await Genre.find().sort('name')

  // 2. Send the genres
  res.send(genres)
})

// Request: A specific genre by id
// Operation: None
// Response: The genre
router.get('/:id', async (req, res) => {
  
  try {
    // 1. Get the genre from the database
    const genre = await Genre.findById(req.params.id)

    // 2. If found, send back the genre
    return res.send(genre)

  } catch (error) {
    // 3. If it doesn't exist, send back 404
    return res.status(404).send('The genre you requested does not exist')
  }
})


// Request: Create a new genre
// Operation: Create a new genre in the database
// Response: The newly created genre
router.post('/', async (req, res) => {
  // 1. Check if the genre name passes the validation
  const { error, value } = validateGenre(req.body)

  // 2. If it doesn't pass, send back 400 (bad request)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // 3. Check if the genre name already exists and send back 400 (bad request) if it exists
  const checkGenreExists = await Genre.find({ name: value.name })
  if (checkGenreExists[0]) {
    return res.status(400).send('That genre already exists')
  }

  // 4. If it doesn't exists, save the new genre to the database and send back the newly created genre
  else {
    let newGenre = new Genre({
      name: value.name
    })

    try {
      newGenre = await newGenre.save()

      return res.send(newGenre)

    } catch (validationErrors) {
      for (field in validationErrors.errors) {
        console.log(validationErrors.errors[field].message)
      }
    }
  }
})


// Request: Update an existing genre by ID
// Operation: Update the genre name in the database
// Response: The updated genre
router.put('/:id', async (req, res) => {
  try {
    // 1. Look for the genre in the database by ID
    const genre = await Genre.findById(req.params.id)

    // 2. If found, validate the proposed name
    const { error, value } = validateGenre(req.body)
    
    // 3. If not valid, send back 400 (bad response)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    
    // 4. If valid, check if the proposed name already exists and send back 404 if it already exists
    const checkGenreExists = await Genre.find({ name: value.name })
    if (checkGenreExists[0]) {
      return res.status(400).send('That genre already exists')
    }

    // 5. If it doesn't already exists, update the genre and send back the updated genre
    else {
      try {
        genre.set({
          name: value.name,
        })
        const result = await genre.save() 
    
        return res.send(result)

      } catch (validationErrors) {
        for (field in validationErrors.errors) {
          console.log(validationErrors.errors[field].message)
        }
      }
      
    }
  } catch (error) {
    // 6. If not found, send back 404 (resource not found)
    return res.status(404).send('The genre you\'re looking for doesn\'t exist')
  }

})


// Request: Delete an existing genre by ID
// Operation: Delete the genre from the database
// Response: The deleted genre
router.delete('/:id', async (req, res) => {
  try {
    // 1. Look for the genre by ID and delete it if found
    const genre = await Genre.findByIdAndRemove(req.params.id)

    // 2. If it exists, send back the deleted genre. For some reason, I need to check if genre !== null because if the ID is close, but not a match, 'await Genre.findByIdAndRemove(req.params.id)' returns null instead of rejecting the promise.
    if (genre !== null) {
      return res.send(genre)
    } else {
      console.log(genre) // For some reason, this will be null if the ID is close but not a match
      return res.status(404).send('The genre you\'re looking for doesn\'t exist') 
    }
    

  } catch (error) {
    // 3. If it doesn't exist, send back 404 (resource not found)
    return res.status(404).send('The genre you\'re looking for doesn\'t exist')
  }
})

module.exports = router