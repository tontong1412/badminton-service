import tournamentCollection from '../../schema/tournament'
import eventCollection from '../../schema/event'
import arrangeMatchLib from '../../libs/match/arrange'
import { EVENT, MATCH } from '../../constants'

const TournamentModel = tournamentCollection.model
const EventModel = eventCollection.model

const arrangeMatch = async (req, res) => {
  const { body } = req

  const tournament = await TournamentModel.findById(body.tournamentID)
    .populate({
      path: 'events',
      select: ['order', 'name', 'format', 'level']
    })
    .exec()

  // sort event by number of match
  tournament.events.sort((a, b) => {
    const matchCountA = a.order.group.reduce((prev, group) => {
      return prev + (group.length * (group.length - 1) / 2)
    }, 0)
    const matchCountB = b.order.group.reduce((prev, group) => {
      return prev + (group.length * (group.length - 1) / 2)
    }, 0)
    return matchCountB - matchCountA
  })

  // arrange round robin
  const arrangedRoundRobinMatches = await Promise.all(tournament.events.map((event, index) => arrangeMatchLib.roundRobin(event, index)))
  const roundRobinMatches = arrangedRoundRobinMatches.reduce((prev, curr) => {
    return [...prev, ...curr]
  }, [])

  // sort match round robin
  roundRobinMatches.sort((a, b) => {
    if (a.step === b.step) {
      if (a.round === b.round) {
        if (a.eventOrder === b.eventOrder) {
          return a.groupOrder - b.groupOrder
        }
        return a.eventOrder > b.eventOrder ? 1 : -1
      }
      if (a.step === MATCH.STEP.GROUP) {
        return a.round > b.round ? 1 : -1
      }
      return a.round < b.round ? 1 : -1
    }
    return a.step === MATCH.STEP.KNOCK_OUT ? 1 : -1
  })

  // arrange time 

  // save to db

  return res.status(200).send(roundRobinMatches)

}
export default arrangeMatch