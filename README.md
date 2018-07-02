# Context
I don't often create express back-ends so I made this cheat sheet to refresh my memory of how to do it. This cheat sheet contains modules that show how to do a bunch of things with Express (request handling, mongoDB, registration, authorization, etc), with lots of comments.

---

## 1_basic_request_handling
Outlines how create endpoints to handle GET, POST, PUT and DELETE requests.

Run ```node 1_basic_request_handling.js``` and use ```1_basic_request_handling.http``` to test the endpoints.

---

## 2_middleware

Brief overview of built-in, third party and custom middleware functions.

---
## 3_debug
Brief overview of how to use the ```debug``` npm package to debug. This is an alternative to using ```console.log``` for debugging.

---
## 4_basic_mongodb
Outlines how to connect to a mongoDB database on the computer via mongoose. Also outlines how to:
1. Save data
2. Query the database
3. Update documents
4. Delete documents

---
## 5_mongodb_validation
Outlines how to use mongoose to validate data before saving it to the database. Includes examples of built-in validators, custom validators and other useful properties.

---
## 6_mongodb_relationships
Brief overview of the different approaches to establishing relationships between documents.

---
## 6.1_referencing_relationships
Example of how to establish relationships between documents via the referencing approach.

---
## 6.2_embedding_relationships
Example of how to establish relationships between documents via the embedding approach.

---
## 7_mongoDB_objectId
Brief overview of mongoDB object Ids and how you can extract the timestamp from them and validate them.

---
## 8.1_account_registration
Example of how to setup a database connection and registration endpoint to register users and save them to the database. Also shows how to hash passwords and create and send JSON web tokens.

Run ```node 8.1_account_registration.js``` and use ```8.1_account_registration.http``` to register users and save them to your database.

---
## 8.2_user_login
Example of how to setup a database connection and login endpoint to login with details that are saved on the database. Run ```node 8.1_account_registration.js``` and use ```8.1_account_registration.http``` to register an account first. Also shows how to generate and send back a JSON web token.

Run ```node 8.2_user_login.js``` and use ```8.2_user_login.http``` to test the login endpoint.

---
## 8.3_protecting_routes
Overview of how to protect endpoints using JSON web tokens. Includes an example of an endpoint that can only be accessed by users who are logged in (send a valid JSON web token)

Run ```node 8.3_protecting_routes.js``` and use ```8.3_protecting_routes.http``` to test the protected and unprotected endpoints.

---
## 8.4_logging_out
Brief overview of how a logging out function could be implemented.

---
## 9_index
Example of how a simple express server can be structured, with separate folders and modules for routes and models.

Run ```node 9_index.js``` and use ```9_index.http``` to test the various endpoints.

---