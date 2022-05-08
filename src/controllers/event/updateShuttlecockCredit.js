import event from '../../schema/event'

const EventModel = event.model

const updateShuttlecockCredit = async (req, res) => {

  const { body } = req
  console.info(`update shuttlecock credit event=${body.eventID} team=${body.teamID}`)

  let updateResponse
  try {
    updateResponse = await EventModel.findOneAndUpdate(
      {
        _id: body.eventID,
        'teams.team': body.teamID
      },
      {
        $inc: { 'teams.$.shuttlecockCredit': body.action === 'increment' ? body.amount : 0 - body.amount }
      },
      { new: true },
    )
    const populateArray = updateResponse.order.group.map((group, i) => `order.group.${i}`)
    await updateResponse.populate({
      path: `${populateArray.join(' ')}`,
      populate: {
        path: 'players'
      }
    }).execPopulate()
  } catch (error) {
    console.error('Error: Failed to update event')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('event not found')
}

export default updateShuttlecockCredit
