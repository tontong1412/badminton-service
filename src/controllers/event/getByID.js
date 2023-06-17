import event from '../../schema/event'
import team from '../../schema/team'

const EventModel = event.model
const TeamModel = team.model

const getByIDEvent = async (req, res) => {
  const { id } = req.params
  try {
    const getByIDResponse = await EventModel.findById(id).populate({
      path: 'order.singleElim order.group teams.team',
      model: TeamModel,
      populate: {
        path: 'players',
        select: 'officialName displayName club photo level'
      }
    }).exec()

    if (getByIDResponse) {
      return res.send(getByIDResponse)
    }

    return res.status(404).send('Event not found')

  } catch (error) {
    console.error('Error: Failed to get event by id')
    throw error
  }
}

export default getByIDEvent
