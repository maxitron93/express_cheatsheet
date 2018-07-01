const express = require('express')
const mongoose = require('mongoose')
const app = express()

// 1. Connect to the database
mongoose.connect('mongodb://localhost/movieRentalsShop')
  .then(() => {
    console.log('Conencted to MongoDB...')

    // 2. After connection is successful, start the app and listen on port 3000
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}`)
    })
  })
  .catch(() => console.log('Could not connect to MongoDB...'))



app.use(express.json())

// For any requests to '/api/genres', use the genres router
const genres = require('./routes/genres')
app.use('/api/genres', genres)

// For any requests to '/api/customers', use the genres router
const customers = require('./routes/customers')
app.use('/api/customers', customers)