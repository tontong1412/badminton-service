import userCollection from '../../schema/user'

const UserModel = userCollection.model

const getCurrentUser = async (req, res) => {
  const { payload: { id } } = req

  let getByIDResponse

  try {
    getByIDResponse = await UserModel.findById(id)
  } catch (error) {
    console.error('Error: Failed to get user by id')
    throw error
  }
  if (getByIDResponse) {
    return res.json({ user: getByIDResponse.toAuthJSON() })
  }
  return res.status(404).json({ error: 'user not found' })
}
export default getCurrentUser
