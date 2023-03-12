import gangCollection from '../../schema/gang'
import matchCollection from '../../schema/match'

const GangModel = gangCollection.model
const MatchModel = matchCollection.model

const removeQueue = async (req, res) => {
  const { body } = req
  console.info(`[removeQueue] gang ${body.gangID} match ${body.matchID}`)

  await MatchModel.findByIdAndDelete(body.matchID)

  try {
    const updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $pull: { queue: body.matchID },
      },
      { new: true },
    ).populate({
      path: 'creator players queue',
      select: 'playerID displayName officialName',
      strictPopulate: false,
      populate: {
        path: 'playerID teamA.team teamB.team',
        strictPopulate: false,
        populate: {
          path: 'players'
        }
      }
    })
    if (updateResponse) {
      return res.send(updateResponse.toObject())
    }
    return res.status(404).send('Gang not found')
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update Gang')
    throw error
  }

}

export default removeQueue
