import player from '../../schema/player'

const PlayerModel = player.model

const removePlayer = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await PlayerModel.findOneAndDelete({ _id: id })
  } catch (error) {
    console.error('Error: Remove player had failed')
    throw error
  }

  if (removeResponse) {
    return res.send(removeResponse.toObject())
  }

  return res.status(404).send('player not found')
}

export default removePlayer
