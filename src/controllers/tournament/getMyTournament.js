import tournament from '../../schema/tournament'
import teamCollection from '../../schema/team'
import eventCollection from '../../schema/event'

const TournamentModel = tournament.model
const TeamModel = teamCollection.model
const EventModel = eventCollection.model

const getMyTournament = async (req, res) => {
  const { payload } = req
  console.info(`[GET] get my-tournament ${payload.playerID}`)
  if (!payload?.playerID) return res.status(401).send()

  const teams = await TeamModel.find({ players: payload.playerID }).populate('players')
  const myEvents = await EventModel.find({
    $or: [
      { 'teams.team': { $in: teams.map(t => t._id) } },
      { 'teams.contact': payload.playerID }
    ]
  }, { _id: 1 })

  const tournaments = await TournamentModel.find({
    $and: [
      {
        $or: [
          { events: { $in: myEvents.map(e => e._id) } },
          { creator: payload.playerID },
          { managers: payload.playerID },
          { umpires: payload.playerID },
        ],
      },
      { status: { $ne: 'finish' } }
    ]

  }).populate({
    path: 'events',
    select: 'name type teams fee',
    populate: {
      path: 'teams.contact teams.team',
      select: 'players officialName displayName club level',
      populate: {
        path: 'players',
        strictPopulate: false,
        select: 'officialName displayName club level'
      }
    }
  })
  res.send(tournaments)
}


export default getMyTournament
