import tournamentCollection from '../../schema/tournament'

const TournamentModel = tournamentCollection.model

const removeManager = async (req, res) => {
  const { body } = req
  // TODO: เช็คว่ามีชื่อใน match ไหนหรือเปล่าก่อนลบ

  let updateResponse
  try {
    updateResponse = await TournamentModel.findOneAndUpdate(
      { _id: body.tournamentID },
      {
        $pull: { managers: body.playerID },
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

export default removeManager
