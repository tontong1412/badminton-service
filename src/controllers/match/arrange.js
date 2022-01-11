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

  // เคลียร์ match ที่เคย arrange ไว้ก่อน
  try {
    await MatchModel.deleteMany({ eventID: { $in: tournament.events } })
  } catch (error) {
    console.error('Error: Failed to reset matches in tournament')
    throw error
  }

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
  const arrangedMatches = await Promise.all(tournament.events.map((event, index) => {
    if (event.format === EVENT.FORMAT.ROUND_ROBIN) {
      return arrangeMatchLib.roundRobin(event, index)
    }
    return []
  }))
  const sortedArrangedMatches = arrangedMatches.reduce((prev, curr) => {
    return [...prev, ...curr]
  }, [])

  // sort match round robin
  sortedArrangedMatches.sort((a, b) => {
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
  let i = 0
  let j = 0
  let isKnockOut
  sortedArrangedMatches.forEach((match, index) => {
    match.matchNumber = index + 1
    if (match.step === MATCH.STEP.GROUP) {
      match.date = moment(body.startTime.group)
        .add(body.matchDuration.group * i, 'minutes')
    } else if (match.step === MATCH.STEP.KNOCK_OUT) {
      if (!isKnockOut) isKnockOut = true
      match.date = moment(body.startTime.knockOut)
        .add(body.matchDuration.knockOut * j, 'minutes')
      knockOutCount++
    }
    if (index % body.numberOfCourt === body.numberOfCourt - 1) i++
    if (isKnockOut && knockOutCount % body.numberOfCourt === 0) j++
  })

  // save to db
  try {
    await MatchModel.insertMany(sortedArrangedMatches)
  } catch (error) {
    console.error('Error: Failed to create match')
    throw error
  }

  // return create result with populate team
  let allMatches
  try {
    allMatches = await MatchModel.find({ eventID: { $in: tournament.events } })
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })
  } catch (error) {
    console.error('Error: Failed to get matches')
    throw error
  }

  return res.status(200).send(allMatches)

}
export default arrangeMatch