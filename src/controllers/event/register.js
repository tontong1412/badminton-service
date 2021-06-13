import mongoose from 'mongoose'
import event from '../../schema/event'
import playerCollection from '../../schema/player'

const EventModel = event.model
const PlayerModel = playerCollection.model

const { ObjectId } = mongoose.Types

const registerEvent = async (req, res) => {
  const { body } = req

  const playersObject = await Promise.all(body.players.map(async (player) => {
    if (player._id) return player._id
    const playerResponse = await PlayerModel.findOne({ officialName: player.officialName })
    if (playerResponse) return playerResponse._id
    try {
      const playerObject = new PlayerModel(player)
      const saveResponse = await playerObject.save()
      return saveResponse._id
    } catch (error) {
      console.error('Error: Fail to create player')
      throw error
    }
  }))

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: body.eventID },
      {
        $push: {
          teams: {
            _id: ObjectId(),
            players: playersObject,
          },
        },
      },
      { new: true },
    )
      .populate('teams.players')
      .exec()
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update event')
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('event not found')
}

export default registerEvent
