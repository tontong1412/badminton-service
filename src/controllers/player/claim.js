import player from '../../schema/player'
import user from '../../schema/user'

const PlayerModel = player.model
const UserModel = user.model

const claimPlayer = async (req, res) => {
  const { body, payload } = req

  if (payload.playerID) return res.status(400).send('can not claim more than 1 player')

  let updateResponse
  try {
    updateResponse = await PlayerModel.findOneAndUpdate(
      { _id: body.playerID },
      { userID: payload.id },
      { new: true },
    )
    await UserModel.findOneAndUpdate(
      { _id: payload.id },
      { playerID: body.playerID },
    )
  } catch (error) {
    console.error('Error: Update player had failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('player not found')
}

export default claimPlayer
