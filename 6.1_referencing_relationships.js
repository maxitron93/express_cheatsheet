/////////////////////////////////////////////////////////////////////////////////////
///// In this example, the author object is REFERENCED inside the course object /////
/////////////////////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

// Connect to the database called 'validatedPlayground'
mongoose.connect('mongodb://localhost/population')
  .then(() => {
    console.log('Connected to MongoDB...')

    // 1. Run this first to create an author
    createAuthor('Maxi', 'My bio', 'My Website');

    // 2. Run this second to create a course
    // createCourse('Node Course', 'INSERT AUTHOR ID FROM MONGODB HERE')

    // 3. Run this last to see the results on the console
    // listCourses()
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Author Model
const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

// Course Model
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: { // This is a reference to the author object
    type: mongoose.Schema.Types.ObjectId, // The type is an object ID
    ref: 'Author' // Reference to the Author collection. When we load a course object and populate the author property, mongoose knows it should query the Authors collection in mongoDB
  }
}));

// createAuthor function
async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

// createCourse function
async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

// listCourses function
async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author', 'name website -_id') // This tells mongoose to query the author collection and populate the author property in the course object. By default, it will return all of the author properties. Here, we've passed 'name website' as the second argument so it will only return the name and website (also have to incluide -_id so it doesn't return the id)
    .select('name author');
  console.log(courses);
}