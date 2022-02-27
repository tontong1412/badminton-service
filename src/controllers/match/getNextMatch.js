import matchCollection from '../../schema/match'
import teamCollection from '../../schema/team'
import tournamentCollection from '../../schema/tournament'

const MatchModel = matchCollection.model
const TeamModel = teamCollection.model
const TournamentModel = tournamentCollection.model

const getNextMatch = async (req, res) => {
  const { payload, query } = req
  try {
    const teams = await TeamModel.find({ players: payload.playerID })
    const nextMatch = await MatchModel.find({
      $and: [
        { eventID: query.eventID },
        {
          $or: [
            { 'teamA.team': { $in: teams } },
            { 'teamB.team': { $in: teams } },
          ]
        },
        { status: 'waiting' }
      ]

    })
      .sort({ matchNumber: 1 })
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })

    const tournament = await TournamentModel.findById(query.tournamentID)
    let latestMatch = await MatchModel.findOne({
      $and: [
        { eventID: { $in: tournament.events } },
        { status: 'playing' }
      ]

    })
      .sort({ matchNumber: -1 })
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })

    if (!latestMatch) {
      latestMatch = await MatchModel.findOne({
        $and: [
          { eventID: { $in: tournament.events } },
          { status: 'finished' }
        ]

      })
        .sort({ matchNumber: -1 })
        .populate({
          path: 'teamA.team teamB.team',
          populate: {
            path: 'players'
          }
        })
    }

    const myMatch = await MatchModel.find({
      $and: [
        { eventID: query.eventID },
        {
          $or: [
            { 'teamA.team': { $in: teams } },
            { 'teamB.team': { $in: teams } },
          ]
        },
      ]

    })
      .sort({ matchNumber: 1 })
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })

    return res.send({
      nextMatch,
      latestMatch,
      myMatch
    })
  } catch (error) {
    console.error('Fail to get next match')
    throw error
  }
}
export default getNextMatch