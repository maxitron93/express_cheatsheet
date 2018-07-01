/////////////////////////////////////////////////////////////////////////////////////
///// In this example, the author object is EMBEDDED inside the course object //////
////////////////////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

// Connect to the database called 'validatedPlayground'
mongoose.connect('mongodb://localhost/population')
  .then(() => {
    console.log('Connected to MongoDB...')

    // Run this to create the course. Notice that a new author object is being created at the same time INSIDE the course object. New author documents cannot be created on their own (if you want them to be embedded). They can only be created in the context of their parent document
    createCourse('Node Course', new Author({ name: 'Maxi' }));

    // Run this after creating the course to see the result in the console
    // listCourses()

    // Run this to update the author inside of the course  
    // updateAuthor("INSERT AUTHOR ID FROM MONGODB HERE")
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

// Author Model
const Author = mongoose.model('Author', authorSchema);

// Course Model
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: authorSchema, // Here, the author property takes the authorSchema defined above
    required: true // Here we're saying that there must be an author (optional)
  }
  
}));

// createCourse function. Notice there is no createAuthor function.
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
  const courses = await Course.find();
  console.log(courses);
}

// updateAuthor function
async function updateAuthor(courseId) {
  const course = await Course.findById(courseId)
  course.author.name = "Batman" // 'author' is an object inside of the course object with a 'name' property
  course.save()
}