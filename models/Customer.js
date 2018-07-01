const mongoose = require('mongoose')
const Joi = require('joi')


// 1. Define schema for customers
const customerSchema = new mongoose.Schema({
  isGold: Boolean,
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  phone: {
    type: Number,
    required: true,
    validate : {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
})

// 2. Compile the schema into a model
const Customer = mongoose.model('Customer', customerSchema)

// Function to validate the incoming customer name and phone number. Joi library used to do the validation
const validateCustomer = (customer) => {
  const schema = {
    name: Joi.string().required().min(3).max(255),
    phone: Joi.string().required().min(5).max(255),
    isGold: Joi.boolean()
  }

  return result = Joi.validate(customer, schema)
}

module.exports.Customer = Customer
module.exports.validateCustomer = validateCustomer