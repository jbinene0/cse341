require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 8080;  // uppercase PORT

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/contacts', require('./routes/contacts'));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});