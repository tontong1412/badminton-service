import event from '../../schema/event'

const EventModel = event.model

const leaveEvent = async (req, res) => {
  const { body, payload } = req

  // NOTE: next mvp
  // const selectedEvent = await EventModel.findOne({ _id: body.eventID })
  // // eslint-disable-next-line eqeqeq
  // const authorizedUser = selectedEvent.teams.find((team) => team._id == body.teamID)?.players

  // if (!authorizedUser) return res.status(404).send('Team not found')
  // if (payload.playerID && !authorizedUser.includes(payload.playerID)) {
  //   return res.status(401).send('You do not have permission to perform this action')
  // }

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
      .populate({
        path: 'teams.team',
        populate: {
          path: 'players'
        }
      })
      .exec()

    if (updateResponse.limit) {
      const waitingList = updateResponse.teams
        .filter(team => team.isInQueue)
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))

      if (waitingList.length > 0) {
        const tempResponse = await EventModel.findOneAndUpdate(
          {
            _id: updateResponse._id,
            'teams._id': waitingList[0]._id
          },
          {
            $set: {
              'teams.$.isInQueue': false,
              'team.$.note': 'แทนคู่ที่ถอนตัว'
            }
          },
          { new: true },
        )
        updateResponse = tempResponse
      }
    }


  } catch (error) {
    console.error('Error: Fail to update event')
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('Event not found')
}

export default leaveEvent
