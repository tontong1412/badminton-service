import player from '../../schema/player'

const PlayerModel = player.model

const createPlayer = async (req, res) => {
  const { body } = req

  const playerObject = new PlayerModel(body)

  let saveResponse
  try {
    saveResponse = await playerObject.save()
  } catch (error) {
    console.error('Error: Failed to create player')
    console.log(error.message)
    if (error.message === 'user exists') {
      const player = await PlayerModel.findOne({ officialName: body.officialName })
      res.send(player)
    }
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createPlayer
