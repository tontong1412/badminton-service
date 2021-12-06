import gangCollection from '../../schema/gang'

const GangModel = gangCollection.model

const removeMember = async (req, res) => {
  const { body } = req

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $pull: { members: body.playerID },
      },
      { new: true },
    )
      .populate({
        path: 'creator players queue managers',
        select: ['playerID', 'displayName', 'officialName', 'shuttlecockUsed', 'status', 'scoreLabel'],
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

export default removeMember
