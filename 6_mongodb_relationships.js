// There are two approaches to handling relationships between documents:

/////////////////////////////////////////////////
// Approach One: Using references (Normalization)
/////////////////////////////////////////////////
let author = {
  name: 'Maxi'
}

let book = {
  author: 'reference to author document' // ID of Maxi (from above)
}
// This is referencing one document (author) in another document (book). However, in document databases, there are no relationships, so eventhough ID is used, there is no association between the book and the author. We can use an ID that doesn't exist and mongoDB wouldn't know and it would still be valid.

///////////////////////////////////////////////////////////
// Approach Two: Using Embedded Documents (Denoramlization)
///////////////////////////////////////////////////////////
let book = {
  author: {
    name: 'Maxi'
  }
}
// This is embeding one document (author) inside another document (book)

/*
Neither approach is the best. Each approach has its pros and cons. It's a tradeoff between query performance and consistency. The first approach (references) has better consistency. I can change the name 'Maxi' in one place and all the books that have Maxi as the author will still be referenced to the updated author object. With the second approach (embedded documents), if I change 'Maxi' in the embedded author object in the book object, none of the other book objects will be updated. But the first approach (references) is slower because it needs to make two queries to get all the information for the book object. The second approach (embedded documents) is faster because we only need one query to get all the information for the book object. Tradeoff between consistency and speed.
*/

/////////////////////////
// Approach Three: Hybrid
/////////////////////////
let author = {
  name: 'Maxi'
  // Assume this author object as 50 other properties. We don't want to embed all those properties inside the book object defined below
}

let book = {
  author: {
    name: 'Maxi', // Only the name is embeded here because it's the most used property
    id: 'reference to author document', // Other less important properties of the author can be referenced (as opposed to embedding the other 50 properties here)
  }
}