import event from '../../schema/event'
import tournament from '../../schema/tournament'
import { EVENT } from '../../constants'

const EventModel = event.model
const TournamentModel = tournament.model

const createEvent = async (req, res) => {
  const { body } = req
  const eventObject = new EventModel({ ...body, step: body.format === EVENT.FORMAT.ROUND_ROBIN ? 'group' : null })
  let saveResponse
  try {
    saveResponse = await eventObject.save()
    await TournamentModel.findOneAndUpdate(
      { _id: body.tournamentID },
      { $push: { events: saveResponse._id } },
    )
  } catch (error) {
    console.error('Error: Failed to create event')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createEvent
