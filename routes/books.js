const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// #swagger.tags = ['Books']
// #swagger.summary = 'Get all books'
// #swagger.description = 'Returns a list of all books in the club library'
// #swagger.responses[200] = { description: 'List of books returned successfully' }
// #swagger.responses[500] = { description: 'Server error' }
router.get('/', bookController.getAllBooks);

// #swagger.tags = ['Books']
// #swagger.summary = 'Get a book by ID'
// #swagger.description = 'Returns a single book by its MongoDB ObjectId'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the book',
     required: true,
     type: 'string'
   } */
// #swagger.responses[200] = { description: 'Book returned successfully' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[404] = { description: 'Book not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.get('/:id', bookController.getBookById);

// #swagger.tags = ['Books']
// #swagger.summary = 'Add a new book'
// #swagger.description = 'Creates a new book in the library. Requires authentication.'
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       title: 'The Pragmatic Programmer',
       author: 'David Thomas',
       isbn: '9780135957059',
       genre: 'Non-Fiction',
       pageCount: 352,
       publishedYear: 2019,
       description: 'A guide to software craftsmanship.'
     }
   } */
// #swagger.responses[201] = { description: 'Book created successfully' }
// #swagger.responses[400] = { description: 'Missing required fields' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[500] = { description: 'Server error' }
router.post('/', isAuthenticated, bookController.createBook);

// #swagger.tags = ['Books']
// #swagger.summary = 'Update a book by ID'
// #swagger.description = 'Updates an existing book. Requires authentication.'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the book',
     required: true,
     type: 'string'
   } */
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       title: 'Updated Title',
       author: 'Updated Author',
       isbn: '9780135957059',
       genre: 'Fiction',
       pageCount: 300,
       publishedYear: 2020,
       description: 'Updated description.'
     }
   } */
// #swagger.responses[204] = { description: 'Book updated successfully' }
// #swagger.responses[400] = { description: 'Invalid ID or missing fields' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[404] = { description: 'Book not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.put('/:id', isAuthenticated, bookController.updateBook);

// #swagger.tags = ['Books']
// #swagger.summary = 'Delete a book by ID'
// #swagger.description = 'Permanently removes a book. Requires authentication.'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the book',
     required: true,
     type: 'string'
   } */
// #swagger.responses[200] = { description: 'Book deleted successfully' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[404] = { description: 'Book not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.delete('/:id', isAuthenticated, bookController.deleteBook);

module.exports = router;