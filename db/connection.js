const { MongoClient } = require('mongodb');

let db;

const connectDb = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('bookclub');
  console.log('Connected to MongoDB - bookclub database');
};

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call connectDb first.');
  return db;
};

module.exports = { connectDb, getDb };
