const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('cse341');
  console.log('MongoDB connected');
  return db;
};

const getDb = () => db;

module.exports = { connectDB, getDb };