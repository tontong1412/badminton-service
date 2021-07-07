import event from '../../schema/event'

const EventModel = event.model

const updateEvent = async (req, res) => {
  const { body, params: { id } } = req

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
    const populateArray = updateResponse.order.group.map((group, i) => `order.group.${i}`)
    await updateResponse.populate({
      path: `order.knockOut ${populateArray.join(' ')}`,
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

export default updateEvent
