import player from '../../schema/player'

const PlayerModel = player.model

const getByIDPlayer = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await PlayerModel.findById(id, { subscription: 0 })
  } catch (error) {
    console.error('Error: Get by ID player had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('player not found')
}

export default getByIDPlayer
