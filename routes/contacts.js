const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

router.get('/', contactsController.getALLContacts);
router.get('/:id', contactsController.getContactById);

module.exports = router;