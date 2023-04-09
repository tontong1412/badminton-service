import passport from 'passport'
import userCollection from '../../schema/user'

const UserModel = userCollection.model

const login = async (req, res) => {
  const { body: { user } } = req

  if (user.facebookID) {
    const loggedInUser = await UserModel.findOne({ facebookID: user.facebookID })
    if (loggedInUser) {
      loggedInUser.token = loggedInUser.generateJWT()
      return res.json({ user: loggedInUser.toAuthJSON() })
    }
  }

  // TODO: เปลี่ยนไปใช้ express validator
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    })
  }
  // TODO: เปลี่ยนไปใช้ express validator
  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    })
  }



  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) throw err
    if (passportUser) {
      const user = passportUser
      user.token = passportUser.generateJWT()
      return res.json({ user: user.toAuthJSON() })
    }
    return res.status(400).json(info)
  })(req, res)
}
export default login
