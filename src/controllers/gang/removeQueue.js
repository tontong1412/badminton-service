import gangCollection from '../../schema/gang'
import matchCollection from '../../schema/match'

const GangModel = gangCollection.model
const MatchModel = matchCollection.model

const removeQueue = async (req, res) => {
  const { body } = req

  await MatchModel.findByIdAndDelete(body.matchID)

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $pull: { queue: body.matchID },
      },
      { new: true },
    )
      .populate({
        path: 'creator players queue',
        select: ['playerID', 'displayName', 'officialName'],
        populate: {
          path: 'playerID teamA.team teamB.team',
          populate: {
            path: 'players'
          }
        }
      })
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update Gang')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('gang not found')
}

export default removeQueue
