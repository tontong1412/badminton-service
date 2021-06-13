import event from '../../schema/event'

const EventModel = event.model

const leaveEvent = async (req, res) => {
  const { body } = req

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
    console.log(error)
    console.error('Error: Fail to update event')
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('event not found')
}

export default leaveEvent
