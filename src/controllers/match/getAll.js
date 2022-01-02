import match from '../../schema/match'
import tournamentCollection from '../../schema/tournament'

const MatchModel = match.model
const TournamentModel = tournamentCollection.model

const getAllMatch = async (req, res) => {
  const { tournamentID, eventID, gangID } = req.query

  let query = { ...req.query }
  if (tournamentID) {
    let tournament
    try {
      tournament = await TournamentModel.findById(tournamentID)
    } catch (error) {
      console.error('Error: Failed to find tournament')
    }
    const userQuery = { ...req.query }

    query = tournament ? { eventID: { $in: tournament.events }, ...userQuery } : { ...userQuery }
  }
  delete query.tournamentID



  let getAllResponse
  try {
    getAllResponse = await MatchModel.find(query)
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })
  } catch (error) {
    console.error('Error: Failed to get all match')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllMatch
