import passport from 'passport'
import LocalStrategy from 'passport-local'
import userCollection from '../schema/user'

const UserModel = userCollection.model

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  UserModel.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } })
      }
      return done(null, user)
    }).catch(done)
}))
