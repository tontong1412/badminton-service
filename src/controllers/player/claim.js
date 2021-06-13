import player from '../../schema/player'

const PlayerModel = player.model

const claimPlayer = async (req, res) => {
  const { body, payload } = req

  let updateResponse
  try {
    updateResponse = await PlayerModel.findOneAndUpdate(
      { _id: body.playerID },
      { userID: payload.id },
      { new: true },
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
