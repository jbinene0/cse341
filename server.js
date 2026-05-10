<<<<<<< HEAD
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
=======
var express = require('express');
var app = express();
const port = process.env.PORT || 3000

app.use('/', require('./routes'));


app.listen(3000, () => console.log('Server is running on port ${port}'));
>>>>>>> 89cc7356fce7666683ee0d91f983cfb59ba88515
