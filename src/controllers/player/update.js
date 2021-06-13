import player from '../../schema/player'

const PlayerModel = player.model

const updatePlayer = async (req, res) => {
  const { body, params: { id } } = req

  let updateResponse
  try {
    updateResponse = await PlayerModel.findOneAndUpdate(
      { _id: id },
      body,
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

export default updatePlayer
