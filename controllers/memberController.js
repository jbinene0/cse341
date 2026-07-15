const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

const getAllMembers = async (req, res) => {
  try {
    const db = getDb();
    const members = await db.collection('members').find().toArray();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const db = getDb();
    const member = await db.collection('members').findOne({ _id: new ObjectId(req.params.id) });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, email, githubUsername, favoriteGenre, bio } = req.body;

    if (!name || !email || !githubUsername) {
      return res.status(400).json({ message: 'All fields are required: name, email, githubUsername' });
    }

    const db = getDb();
    const result = await db.collection('members').insertOne({
      name,
      email,
      githubUsername,
      favoriteGenre: favoriteGenre || null,
      bio: bio || null,
      booksRead: [],
      joinedDate: new Date(),
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { name, email, githubUsername, favoriteGenre, bio } = req.body;

    if (!name || !email || !githubUsername) {
      return res.status(400).json({ message: 'All fields are required: name, email, githubUsername' });
    }

    const db = getDb();
    const result = await db.collection('members').replaceOne(
      { _id: new ObjectId(req.params.id) },
      { name, email, githubUsername, favoriteGenre: favoriteGenre || null, bio: bio || null, booksRead: [] }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const result = await db.collection('members').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMembers, getMemberById, createMember, updateMember, deleteMember };
