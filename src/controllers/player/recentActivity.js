import player from '../../schema/player'
import teamCollection from '../../schema/team'
import tournamentCollection from '../../schema/tournament'
import eventCollection from '../../schema/event'

const PlayerModel = player.model
const TournamentModel = tournamentCollection.model
const TeamModel = teamCollection.model
const EventModel = eventCollection.model

const RecentActivity = async (req, res) => {
  const { id } = req.params

  try {
    const teams = await TeamModel.find({ players: id })
    const teamsID = teams.map(t => t._id)
    const events = await EventModel.find({ 'teams.team': { $in: teamsID } }).select('_id name')
    const tournaments = await TournamentModel
      .find({ events: { $in: events } })
      .sort({ startDate: -1 })
      .limit(4)
      .select('name events')
    const response = tournaments.map(t => {
      const filteredEvents = events.filter(value => t.events.includes(value._id))
      t.events = [...filteredEvents]
      return t
    })
    return res.send(response)
  } catch (error) {
    console.error('Error: Get by ID player had failed')
    throw error
  }
}

export default RecentActivity
