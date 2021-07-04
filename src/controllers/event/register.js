import mongoose from 'mongoose'
import eventCollection from '../../schema/event'
import playerCollection from '../../schema/player'
import teamCollection from '../../schema/team'


const EventModel = eventCollection.model
const PlayerModel = playerCollection.model
const TeamModel = teamCollection.model

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

  let teamObject = await TeamModel.findOne({ players: { $all: playersObject } })
  if (!teamObject) {
    try {
      const newTeam = new TeamModel({ players: playersObject })
      teamObject = await newTeam.save()
    } catch (error) {
      console.error('Error: Fail to create team')
      throw error
    }
  }

  const eventExist = await EventModel.findById(body.eventID)
  if (!eventExist) return res.status(404).send('event not found')

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: body.eventID, 'teams.team': { $ne: ObjectId(teamObject._id) } },
      {
        $push: { teams: { team: ObjectId(teamObject._id) } }
      },
      { new: true },
    )
      .populate({
        path: 'teams.team',
        populate: {
          path: 'players'
        }
      })
      .exec()
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update event')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(409).send('duplicate team')
}

export default registerEvent
