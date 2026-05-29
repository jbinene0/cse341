const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// #swagger.tags = ['Contacts']
// #swagger.description = 'Returns all contacts'
router.get('/', contactsController.getALLContacts);

// #swagger.tags = ['Contacts']
// #swagger.description = 'Returns a single contact by ID'
router.get('/:id', contactsController.getContactById);

// #swagger.tags = ['Contacts']
// #swagger.description = 'Create a new contact'
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       firstName: 'John',
       lastName: 'Doe',
       email: 'john@example.com',
       phone: '555-1234'
     }
   } */
router.post('/', contactsController.createContact);

// #swagger.tags = ['Contacts']
// #swagger.description = 'Update a contact by ID'
/* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
       firstName: 'Jane',
       lastName: 'Doe',
       email: 'jane@example.com',
       phone: '555-5678'
     }
   } */
router.put('/:id', contactsController.updateContact);

// #swagger.tags = ['Contacts']
// #swagger.description = 'Delete a contact by ID'
router.delete('/:id', contactsController.deleteContact);

module.exports = router;