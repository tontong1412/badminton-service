import player from '../../schema/player'

const PlayerModel = player.model

const subscribe = async (req, res) => {
  const { body, params: { id }, payload } = req
  console.info(`[PUT] subscribe player ${id}`)
  if (payload.playerID !== id) return res.status(401).send('Permission Denied')
  let updateResponse
  try {
    updateResponse = await PlayerModel.findOneAndUpdate(
      { _id: id },
      {
        subscription: {
          endpoint: body.endpoint,
          expirationTime: body.expirationTime,
          keys: body.keys
        }
      },
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
export default subscribe
