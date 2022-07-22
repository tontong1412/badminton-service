import tournament from '../../schema/tournament'

const TournamentModel = tournament.model

const getAllTournament = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await TournamentModel.find({}).sort({ startDate: -1 })
      .populate('events').exec()
  } catch (error) {
    console.error('Error: Get all tournament had failed')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllTournament
