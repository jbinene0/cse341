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
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const db = getDb();
        const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, birthday } = req.body;

        if (!firstName || !lastName || !email || !phone || !birthday) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = getDb();
        const result = await db.collection('contacts').insertOne({ firstName, lastName, email, phone, birthday });

        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateContact = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const id = new ObjectId(req.params.id);
        const { firstName, lastName, email, phone, birthday } = req.body;

        if (!firstName || !lastName || !email || !phone || !birthday) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = getDb();
        const result = await db.collection('contacts').replaceOne(
            { _id: id },
            { firstName, lastName, email, phone, birthday }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const id = new ObjectId(req.params.id);

        const db = getDb();
        const result = await db.collection('contacts').deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getALLContacts, getContactById, createContact, updateContact, deleteContact };