import match from '../../schema/match'
import socket from '../../server'

const MatchModel = match.model

const updateMatch = async (req, res) => {
  const { body, params: { id } } = req
  let updateResponse
  try {
    updateResponse = await MatchModel.findOneAndUpdate(
      { _id: id },
      body,
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
    socket.emit('update-match')
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('match not found')
}

export default updateMatch
