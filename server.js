require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { connectDb } = require('./db/connection');
const passport = require('./passport');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// REST routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// OAuth routes
// #swagger.tags = ['Auth']
// #swagger.summary = 'Login with GitHub'
// #swagger.description = 'Redirects to GitHub for OAuth authentication'
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// #swagger.tags = ['Auth']
// #swagger.summary = 'GitHub OAuth callback'
// #swagger.description = 'GitHub redirects here after authentication'
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/auth/success')
);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Auth success'
// #swagger.description = 'Returns the authenticated user info'
app.get('/auth/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: 'Logged in successfully', user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// #swagger.tags = ['Auth']
// #swagger.summary = 'Auth failure'
// #swagger.description = 'Returns error when GitHub login fails'
app.get('/auth/failure', (req, res) => {
  res.status(401).json({ message: 'GitHub authentication failed' });
});

// #swagger.tags = ['Auth']
// #swagger.summary = 'Check auth status'
// #swagger.description = 'Returns whether the user is currently logged in'
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(200).json({ authenticated: false });
  }
});

// #swagger.tags = ['Auth']
// #swagger.summary = 'Logout'
// #swagger.description = 'Logs the user out and clears the session'
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Book Club API is running',
    docs: '/api-docs',
    routes: { books: '/books', members: '/members' },
    auth: { login: '/auth/github', status: '/auth/status', logout: '/auth/logout' },
  });
});

// Start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`Login: http://localhost:${PORT}/auth/github`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });