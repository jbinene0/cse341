const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

const getAllBooks = async (req, res) => {
  try {
    const db = getDb();
    const books = await db.collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const db = getDb();
    const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, pageCount, publishedYear, description } = req.body;

    if (!title || !author || !isbn || !genre || !pageCount || !publishedYear || !description) {
      return res.status(400).json({ message: 'All fields are required: title, author, isbn, genre, pageCount, publishedYear, description' });
    }

    const db = getDb();
    const result = await db.collection('books').insertOne({
      title,
      author,
      isbn,
      genre,
      pageCount,
      publishedYear,
      description,
      addedBy: req.user ? req.user.githubUsername : 'anonymous',
      dateAdded: new Date(),
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { title, author, isbn, genre, pageCount, publishedYear, description } = req.body;

    if (!title || !author || !isbn || !genre || !pageCount || !publishedYear || !description) {
      return res.status(400).json({ message: 'All fields are required: title, author, isbn, genre, pageCount, publishedYear, description' });
    }

    const db = getDb();
    const result = await db.collection('books').replaceOne(
      { _id: new ObjectId(req.params.id) },
      { title, author, isbn, genre, pageCount, publishedYear, description }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
