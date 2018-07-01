const express = require('express')
const router = express.Router()
const { Customer, validateCustomer } = require('../models/Customer')

//////////////////////////
///// ROUTE HANDLERS /////
//////////////////////////

// Request: All the customers
// Operation: None
// Response: All the customers
router.get('/', async (req, res) => {
  // 1. Get the customers from the database and sort by name
  const customers = await Customer.find().sort('name')

  // 2. Send the customers
  res.send(customers)
})


// Request: Create a new customer
// Operation: Create a new customer in the database
// Response: The newly created customer
router.post('/', async (req, res) => {
  // 1. Check if the customer name passes the validation
  const { error, value } = validateCustomer(req.body)

  // 2. If it doesn't pass, send back 400 (bad request)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // 3. If it passes, save the new customer to the database and send back the newly created customer
  let newCustomer = new Customer({
    isGold: value.isGold,
    name: value.name,
    phone: value.phone
  })

  try {
    newCustomer = await newCustomer.save()

    return res.send(newCustomer)

  } catch (validationErrors) {
    for (field in validationErrors.errors) {
      console.log(validationErrors.errors[field].message)
    }
  }
})

module.exports = router