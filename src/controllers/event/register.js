import mongoose from 'mongoose'
import eventCollection from '../../schema/event'
import playerCollection from '../../schema/player'
import teamCollection from '../../schema/team'
import transaction from '../../schema/transaction'


const EventModel = eventCollection.model
const PlayerModel = playerCollection.model
const TeamModel = teamCollection.model
const TransactionModel = transaction.model

const { ObjectId } = mongoose.Types

const registerEvent = async (req, res) => {
  const { body } = req

  const playersObject = await Promise.all(body.players.map(async (player) => {
    if (player._id) {
      await PlayerModel.findByIdAndUpdate(player._id, player)
      return player._id
    }
    const playerResponse = await PlayerModel.findOneAndUpdate({ officialName: player.officialName }, player)
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

  const contactID = async () => {
    const { contact } = body
    if (!contact) return null
    if (contact._id) {
      await PlayerModel.findByIdAndUpdate(contact._id, contact)
      return contact._id
    }
    const playerResponse = await PlayerModel.findOneAndUpdate({ displayName: contact.name }, contact)
    if (playerResponse) return playerResponse._id
    try {
      const playerObject = new PlayerModel({
        ...contact,
        officialName: contact.name
      })
      const saveResponse = await playerObject.save()
      return saveResponse._id
    } catch (error) {
      console.error('Error: Fail to create player')
      throw error
    }
  }

  let teamObject = await TeamModel.findOne({
    players: {
      $all: playersObject,
      $size: playersObject.length
    }
  })

  if (!teamObject) {
    try {
      const newTeam = new TeamModel({ players: playersObject })
      teamObject = await newTeam.save()
    } catch (error) {
      console.log(error)
      console.error('Error: Fail to create team')
      throw error
    }
  }
  const event = await EventModel.findById(body.eventID)
  if (!event) return res.status(404).send('event not found')
  console.log(teamObject)
  console.log(contactID())
  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: body.eventID, 'teams.team': { $ne: ObjectId(teamObject._id) } },
      {
        $push: {
          teams: {
            team: ObjectId(teamObject._id),
            _id: new mongoose.Types.ObjectId(),
            isInQueue: event.limit ? event.teams.length >= event.limit : false,
            contact: await contactID()
          }
        }
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
  return res.status(409).send('already register')
}

export default registerEvent
