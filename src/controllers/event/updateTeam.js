import event from '../../schema/event'
import { uploadPhoto } from '../../libs/media'
import { CLOUDINARY } from '../../config'

const EventModel = event.model

const updateStatus = async (req, res) => {
  const { body } = req

  if (body.slip) {
    const slipUrl = await uploadPhoto(body.slip, `${CLOUDINARY.PREFIX || ''}event/${body.eventID}/team`, body.teamID)
    body.field = 'slip'
    body.value = slipUrl.url
  }

  let updateObj = {
    [`teams.$.${body.field}`]: body.value
  }

  if (body.slip) {
    updateObj = {
      ...updateObj,
      'teams.$.paymentStatus': body.paymentStatus
    }
  }

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      {
        _id: body.eventID,
        'teams._id': body.teamID
      },
      {
        $set: updateObj
      },
      { new: true },
    )
    const populateArray = updateResponse.order.group.map((group, i) => `order.group.${i}`)
    await updateResponse.populate({
      path: `${populateArray.join(' ')}`,
      populate: {
        path: 'players'
      }
    }).execPopulate()
  } catch (error) {
    console.error('Error: Failed to update event')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('event not found')
}

export default updateStatus
