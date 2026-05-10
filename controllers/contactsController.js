const { get } = require('mongoose');
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

const getALLContacts = async (req, res) => {
    try {
        const db = getDb();
        const contacts = await db.collection('contacts').find().toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });   
    }
}; 

const getContactById = async (req, res) => {
    try {
        const db = getDb();
        const contact = await db.collection('contacts').findOne({_id: new ObjectId(req.params.id)});
        if (!contact) return res.status(404).json({message: 'Contact not found'});
        res.status(200).json(contact);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

module.exports = { getALLContacts, getContactById };