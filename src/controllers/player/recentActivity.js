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
    const events = await EventModel.find({ 'teams.team': { $in: teams } })
    const tournaments = await TournamentModel
      .find({ events: { $in: events } })
      .limit(3)
      .select('name')
    return res.send(tournaments)
  } catch (error) {
    console.error('Error: Get by ID player had failed')
    throw error
  }
}

export default RecentActivity
