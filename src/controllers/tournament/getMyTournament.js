import tournament from '../../schema/tournament'
import teamCollection from '../../schema/team'
import eventCollection from '../../schema/event'

const TournamentModel = tournament.model
const TeamModel = teamCollection.model
const EventModel = eventCollection.model

const getMyTournament = async (req, res) => {
  const { payload } = req
  if (!payload?.playerID) return res.status(401).send()

  try {
    const teams = await TeamModel.find({ players: payload.playerID })
    const myEvents = await EventModel.find({
      'teams.team': { $in: teams }
    })
    const tournaments = await TournamentModel.find({
      $or: [
        { events: { $in: myEvents } },
        { creator: payload.playerID },
        { managers: payload.playerID },
        { umpires: payload.playerID }
      ],
    }).populate({
      path: 'events events.teams events.order managers',
      populate: {
        path: `players teams.team teams.contact`,
        populate: {
          path: 'players group.team',
          populate: {
            path: 'players'
          }
        }
      }
    })
    return res.send(tournaments)
  }
  catch (error) {

  }

  // let getAllResponse
  // try {
  //   getAllResponse = await TournamentModel.find({
  //     'events.teams.team'
  //   })
  //     .populate('events').exec()
  // } catch (error) {
  //   console.error('Error: Get all tournament had failed')
  //   throw error
  // }

  // return res.send(getAllResponse)
}

export default getMyTournament
