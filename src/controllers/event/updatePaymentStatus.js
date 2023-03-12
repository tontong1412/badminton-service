import event from '../../schema/event'
import team from '../../schema/team'

const EventModel = event.model
const TeamModel = team.model

const updatePaymentStatus = async (req, res) => {
  const { body } = req

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      {
        _id: body.eventID,
        'teams._id': body.teamID
      },
      {
        $set: { 'teams.$.paymentStatus': body.paymentStatus }
      },
      { new: true },
    ).populate({
      path: 'order.singleElim order.group teams.team',
      model: TeamModel,
      populate: {
        path: 'players',
        select: 'officialName displayName club photo'
      }
    }).exec()
  } catch (error) {
    console.error('Error: Failed to update event')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('event not found')
}

export default updatePaymentStatus
