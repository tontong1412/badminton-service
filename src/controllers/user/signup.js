import userCollection from '../../schema/user'

const UserModel = userCollection.model

const signup = async (req, res) => {
  const { body: { user } } = req

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

  const userObject = new UserModel(user)

  userObject.setPassword(user.password)
  let saveResponse
  try {
    saveResponse = await userObject.save()
  } catch (error) {
    if (error.message === 'user exists') {
      return res.status(400).send({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' })
    }
    console.error('Error: Failed to create user')
    throw error
  }

  return res.json({ user: saveResponse.toAuthJSON() })
}
export default signup