import event from '../../schema/event'

const eventModel = event.model

const getAllEvent = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await eventModel.find({})
    //   .populate('division.team.member').exec()
  } catch (error) {
    console.error('Error: Failed to get all event')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllEvent
