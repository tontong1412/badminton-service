import event from '../../schema/event'
import player from '../../schema/player'

const EventModel = event.model
const PlayerModel = player.model

const leaveEvent = async (req, res) => {
  const { body, payload } = req

  const selectedEvent = await EventModel.findOne({ _id: body.eventID })
  // eslint-disable-next-line eqeqeq
  const authorizedUser = selectedEvent.teams.find((team) => team._id == body.teamID)?.players
  const currentPlayer = await PlayerModel.findOne({ userID: payload.id }, { _id: true })

  if(!authorizedUser) return res.status(404).send('Team not found')
  if (acurrentPlayer?._id && !authorizedUser.includes(currentPlayer._id)) {
    return res.status(401).send('You do not have permission to perform this action')
  }

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      { _id: body.eventID },
      {
        $pull: {
          teams: { _id: body.teamID },
        },
      },
      { new: true },
    )
      .populate('teams.players')
      .exec()
  } catch (error) {
    console.error('Error: Fail to update event')
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('Event not found')
}

export default leaveEvent
