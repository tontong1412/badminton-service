import event from '../../schema/event'
import tournament from '../../schema/tournament'

const EventModel = event.model
const TournamentModel = tournament.model

const removeEvent = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await EventModel.findOneAndDelete({ _id: id })
  } catch (error) {
    console.error('Error: Failed to remove event')
    throw error
  }

  if (removeResponse) {
    try {
      await TournamentModel.updateMany(
        {},
        { $pull: { events: id } },
        { multi: true },
      )
      return res.send(removeResponse.toObject())
    } catch (error) {
      console.error('Error: Failed to remove event from tournament')
      throw error
    }
  }

  return res.status(404).send('event not found')
}

export default removeEvent
