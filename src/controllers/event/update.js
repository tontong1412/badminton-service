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
