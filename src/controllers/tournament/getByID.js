import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const getByIDTournament = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await TournamentModel.findById(id)
      .populate('events')
  } catch (error) {
    console.error('Error: Get by ID tournament had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('tournament not found')
}

export default getByIDTournament
