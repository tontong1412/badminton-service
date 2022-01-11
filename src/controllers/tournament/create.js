import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const createTournament = async (req, res) => {
  const { body, payload: { playerID } } = req

  const tournamentObject = new TournamentModel({ ...body, creator: playerID })

  let saveResponse
  try {
    saveResponse = await tournamentObject.save()
  } catch (error) {
    console.error('Error: Failed to create tournament')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createTournament
