/*
Logging out is done on the front-end. When the user clicks the 'logout' button on the website, the front-end code should delete the token. Once the token is deleted from the client, they will not be able to visit anymore protected routes until they log back in and get another token from the server.

Maybe an exception would be if the token is stored in a cookie or hidden cookie. I think only the server can alter a cookie. If that's the case, you would need to create a logout route that removes the token from the cookie.
*/