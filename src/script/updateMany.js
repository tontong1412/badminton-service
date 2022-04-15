
import controller from '../controllers/event/updateTeam'
import '../libs/mongo/getMongoConnect'
import tournament from '../schema/tournament'
import '../schema/player'
import '../schema/team'

const TournamentModel = tournament.model
const update = async () => {
  const tournament = await TournamentModel.findById('624be90b1221b1b35f37bf4b')
  await tournament.populate({
    path: 'events events.teams events.order managers contact umpires',
    populate: {
      path: `players teams.team teams.contact`,
      populate: {
        path: 'players group.team',
        populate: {
          path: 'players'
        }
      }
    }
  }).execPopulate()
  tournament.events.forEach(event => {
    event.teams.forEach(async team => {
      const body = {
        eventID: event._id,
        teamID: team._id,
        field: 'paymentStatus',
        value: 'paid'
      }
      await controller({ body }, { send: () => { } })
    })
  })

  return
  // await controller({ body }, { send: () => { } })
}
update()