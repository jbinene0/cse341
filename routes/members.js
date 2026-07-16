const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// #swagger.tags = ['Members']
// #swagger.summary = 'Get all members'
// #swagger.description = 'Returns a list of all book club members'
// #swagger.responses[200] = { description: 'List of members returned successfully' }
// #swagger.responses[500] = { description: 'Server error' }
router.get('/', memberController.getAllMembers);

// #swagger.tags = ['Members']
// #swagger.summary = 'Get a member by ID'
// #swagger.description = 'Returns a single member by their MongoDB ObjectId'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the member',
     required: true,
     type: 'string'
   } */
// #swagger.responses[200] = { description: 'Member returned successfully' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[404] = { description: 'Member not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.get('/:id', memberController.getMemberById);

// #swagger.tags = ['Members']
// #swagger.summary = 'Create a new member'
// #swagger.description = 'Registers a new book club member. Requires authentication.'
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       name: 'Jane Smith',
       email: 'jane@example.com',
       githubUsername: 'janesmith',
       favoriteGenre: 'Sci-Fi',
       bio: 'Avid reader and coffee enthusiast.'
     }
   } */
// #swagger.responses[201] = { description: 'Member created successfully' }
// #swagger.responses[400] = { description: 'Missing required fields' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[500] = { description: 'Server error' }
router.post('/', isAuthenticated, memberController.createMember);

// #swagger.tags = ['Members']
// #swagger.summary = 'Update a member by ID'
// #swagger.description = 'Updates an existing member profile. Requires authentication.'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the member',
     required: true,
     type: 'string'
   } */
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       name: 'Updated Name',
       email: 'updated@example.com',
       githubUsername: 'updatedusername',
       favoriteGenre: 'Mystery',
       bio: 'Updated bio.'
     }
   } */
// #swagger.responses[204] = { description: 'Member updated successfully' }
// #swagger.responses[400] = { description: 'Invalid ID or missing fields' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[404] = { description: 'Member not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.put('/:id', isAuthenticated, memberController.updateMember);

// #swagger.tags = ['Members']
// #swagger.summary = 'Delete a member by ID'
// #swagger.description = 'Permanently removes a member. Requires authentication.'
/* #swagger.parameters['id'] = {
     in: 'path',
     description: 'MongoDB ObjectId of the member',
     required: true,
     type: 'string'
   } */
// #swagger.responses[200] = { description: 'Member deleted successfully' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[401] = { description: 'Not authenticated' }
// #swagger.responses[404] = { description: 'Member not found' }
// #swagger.responses[500] = { description: 'Server error' }
router.delete('/:id', isAuthenticated, memberController.deleteMember);

module.exports = router;