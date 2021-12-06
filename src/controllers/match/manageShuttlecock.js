import match from '../../schema/match'

const MatchModel = match.model

const updateMatch = async (req, res) => {
  const { body } = req

  let updateResponse
  try {
    updateResponse = await MatchModel.findOneAndUpdate(
      { _id: body.matchID },
      { $inc: { 'shuttlecockUsed': body.action === 'increment' ? 1 : -1 } },
      { new: true },
    ).populate({
      path: 'teamA.team teamB.team',
      populate: {
        path: 'players'
      }
    })
  } catch (error) {
    console.error('Error: Failed to update match')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('match not found')
}

export default updateMatch
