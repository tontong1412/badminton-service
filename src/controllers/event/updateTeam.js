import event from '../../schema/event'

const EventModel = event.model

const updateStatus = async (req, res) => {
  const { body } = req

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      {
        _id: body.eventID,
        'teams._id': body.teamID
      },
      {
        $set: {
          [`teams.$.${body.field}`]: body.value
        }
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
