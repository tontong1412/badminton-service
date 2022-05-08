import mongoose from 'mongoose'
import gangCollection from '../../schema/gang'
import playerCollection from '../../schema/player'


const GangModel = gangCollection.model
const PlayerModel = playerCollection.model

const registerGang = async (req, res) => {
  const { body } = req
  let player
  if (body.player._id) {
    player = body.player._id
  } else {
    const playerResponse = await PlayerModel.findOne({
      ...body.player,
      officialName: null
    })
    if (playerResponse) {
      player = playerResponse._id
    } else {
      try {
        const playerObject = new PlayerModel(body.player)
        const saveResponse = await playerObject.save()
        player = saveResponse._id
      } catch (error) {
        console.error('Error: Fail to create player')
        throw error
      }
    }
  }

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $addToSet: { players: player }
      },
      { new: true },
    )
      .populate({
        path: 'players',
      })
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update gang')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  res.status(404).send('gang not found')
}

export default registerGang
