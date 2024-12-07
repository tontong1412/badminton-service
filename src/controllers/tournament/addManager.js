import tournamentCollection from '../../schema/tournament'


const TournamentModel = tournamentCollection.model

const addManager = async (req, res) => {
  const { body } = req
  let player = body.playerID

  let updateResponse
  try {
    updateResponse = await TournamentModel.findOneAndUpdate(
      { _id: body.tournamentID },
      {
        $addToSet: { managers: player }
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

export default addManager
