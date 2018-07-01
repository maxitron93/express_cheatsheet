/*

_id: 5b3887bf8f9c4803d27b87c1

The object ID in a mongoDB database is 12 bytes long and includes the following:

First 4 bytes: timestamp for when the document was created
Next 3 bytes: machine identifier
Next 2 bytes: process identifier
Next 3 bytes: counter

It's possible to create two documents with the same id if you create ~16 million documents at exactly the same time, on the same machine, with the same process.


*/


// Here's how to extract the timestamp from the ObjectId:
const mongoose = require('mongoose')

const id = new mongoose.Types.ObjectId()

const timestamp = id.getTimestamp()

console.log(timestamp)


// Here's how to test if a string is a valid ObjectId:
const isValid = mongoose.Types.ObjectId.isValid('Testing123') // Returns false since 'Testing123' is not a valid ObjectId
console.log(isValid)
// Validating objectID is useful for validating requests