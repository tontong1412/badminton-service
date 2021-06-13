import mongoose from 'mongoose'
import event from '../../schema/event'

const EventModel = event.model

const { ObjectId } = mongoose.Types

const registerEvent = async (req, res) => {
  const { body } = req

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: ObjectId(body.eventID) },
      {
        $push: {
          teams: {
            _id: ObjectId(),
            players: body.players,
          },
        },
      },
      { new: true },
    )
  } catch (error) {
    console.error('Error: Fail to update event')
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('event not found')
}

export default registerEvent
