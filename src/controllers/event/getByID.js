import event from '../../schema/event'

const EventModel = event.model

const getByIDEvent = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await EventModel.findById(id)
  } catch (error) {
    console.error('Error: Failed to get event by id')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('event not found')
}

export default getByIDEvent
