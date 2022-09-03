import event from '../../schema/event'
import tournamentCollection from '../../schema/tournament'

const EventModel = event.model
const TournamentModel = tournamentCollection.model

const removeEvent = async (req, res) => {
  const { payload } = req
  const { id } = req.params


  const tournament = await TournamentModel.findOne({ events: id })
  if (payload.playerID != tournament.creator) return res.status(401).send('Permission Denied')

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
