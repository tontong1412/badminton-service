import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const updateTournament = async (req, res) => {
  const { body, params: { id } } = req

  let updateResponse
  try {
    updateResponse = await TournamentModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
  } catch (error) {
    console.error('Error: Update tournament had failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('tournament not found')
}

export default updateTournament
