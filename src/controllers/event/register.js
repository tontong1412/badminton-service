import mongoose from 'mongoose'
import { CLOUDINARY } from '../../config'
import { uploadPhoto } from '../../libs/media'
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
  console.info(`[POST] register event ${body.eventID}`)

  const playersObject = await Promise.all(body.players.map(async (player) => {
    let photo = player.photo
    delete player.photo

    // if body already has playerID update info and return
    if (player._id) {
      if (photo) {
        const photoUrl = await uploadPhoto(photo, `${CLOUDINARY.PREFIX}player`, player._id)
        player.photo = photoUrl.url
      }
      await PlayerModel.findByIdAndUpdate(player._id, player)
      return player._id
    }

    // if body doesn't have playerID find by officialName to see if the player already in the system 
    // if already have update info and return
    const playerResponse = await PlayerModel.findOneAndUpdate({ officialName: player.officialName }, player)
    if (playerResponse) {
      if (photo) {
        const photoUrl = await uploadPhoto(photo, `${CLOUDINARY.PREFIX}player`, id)
        await PlayerModel.findByIdAndUpdate(playerResponse._id, { photo: photoUrl.url })
      }
      return playerResponse._id
    }

    // if body doesn't have playerID and the player never exist in the system
    // create new player and update photo after get id of the player
    try {
      const playerObject = new PlayerModel(player)
      const saveResponse = await playerObject.save()
      if (photo) {
        const photoUrl = await uploadPhoto(photo, `${CLOUDINARY.PREFIX}player`, saveResponse._id)
        await PlayerModel.findByIdAndUpdate(saveResponse._id, { photo: photoUrl.url })
      }
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
    const playerResponse = await PlayerModel.findOneAndUpdate({ officialName: contact.officialName }, contact)
    if (playerResponse) return playerResponse._id
    try {
      const playerObject = new PlayerModel({
        ...contact,
        officialName: contact.officialName
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
