const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { getDb } = require('./db/connection');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDb();

        // Check if member already exists
        let member = await db.collection('members').findOne({ oauthId: profile.id });

        if (!member) {
          // Create new member on first login
          const result = await db.collection('members').insertOne({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.noemail`,
            githubUsername: profile.username,
            oauthId: profile.id,
            avatarUrl: profile.photos?.[0]?.value || null,
            favoriteGenre: null,
            bio: null,
            booksRead: [],
            joinedDate: new Date(),
          });
          member = await db.collection('members').findOne({ _id: result.insertedId });
        }

        return done(null, member);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = getDb();
    const user = await db.collection('members').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
