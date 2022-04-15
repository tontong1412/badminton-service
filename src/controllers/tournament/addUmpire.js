import tournamentCollection from '../../schema/tournament'


const TournamentModel = tournamentCollection.model

const addUmpire = async (req, res) => {
  const { body } = req
  let player = body.playerID
  if (!player) return res.status(404).send('กรรมการต้องมีบัญชีผู้ใช้')

  let updateResponse
  try {
    updateResponse = await TournamentModel.findOneAndUpdate(
      { _id: body.tournamentID },
      {
        $addToSet: { umpires: player }
      },
      { new: true },
    )
      .populate({
        path: 'players',
      })
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update tournament')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  res.status(404).send('tournament not found')
}

export default addUmpire
