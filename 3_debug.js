const express = require('express')
const app = express()
// Create debug namespaces 
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')

// Middleware that does some database work when a request is recieved
app.use((req, res, next) => {
  dbDebugger('Connected to the database') // This will print "Connected to the database" to the console
  next()
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  startupDebugger(`Listening on port ${3000}`) // This will print "Listening on port 3000" to the console
})

/*
This debugger is better than using console.log for debugging since we can control what messages are shown. To use the debugger, run:
DEBUG=app:startup nodejs 3_debug.js (to only see debug messages in the app:startup namespace)
OR
DEBUG=app:db nodejs 3_debug.js (to only see debug messages in the app:db namespace)
OR
DEBUG=app:startup,app:db nodejs 3_debug.js (to see debug messages in both the app:startup and app:db namespaces)
OR 
DEBUG= nodejs 3_debug.js (to no longer see any debugging messages)
OR
DEBUG=app:* node 3_debug.js (to see all the debug messages in the app: namespace)
*/