import moment from 'moment'
import tournamentCollection from '../../schema/tournament'
import matchCollection from '../../schema/match'
import arrangeMatchLib from '../../libs/match/arrange'
import { EVENT, MATCH } from '../../constants'

const TournamentModel = tournamentCollection.model
const MatchModel = matchCollection.model

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
  // ตอนนี้ทำได้แค่จัดแข่งแบบ 2 วันจบ
  // วันแรก group วันที่สอง knock out
  let knockOutCount = 0
  roundRobinMatches.forEach((match, index) => {
    match.matchNumber = index + 1
    if (match.step === MATCH.STEP.GROUP) {
      match.date = moment(body.startTime.group)
        .add(body.matchDuration.group * index, 'minutes')
    } else if (match.step === MATCH.STEP.KNOCK_OUT) {
      match.date = moment(body.startTime.knockOut)
        .add(1, 'days')
        .add(body.matchDuration.knockOut * knockOutCount, 'minutes')
      knockOutCount++
    }
  })

  // save to db
  let saveResponse
  try {
    saveResponse = await MatchModel.insertMany(roundRobinMatches)
  } catch (error) {
    console.error('Error: Failed to create match')
    throw error
  }

  // Todo: หาวิธี return create result with populate team

  return res.status(200).send(saveResponse)

}
export default arrangeMatch