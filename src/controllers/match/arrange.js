import moment from 'moment'
import tournamentCollection from '../../schema/tournament'
import matchCollection from '../../schema/match'
import arrangeMatchLib from '../../libs/match/arrange'
import { EVENT, MATCH } from '../../constants'
import sortLib from '../../libs/match/sort'

const TournamentModel = tournamentCollection.model
const MatchModel = matchCollection.model

const arrangeMatch = async (req, res) => {
  let {
    tournamentID,
    numberOfCourt,
    numberOfCourtKnockOut,
    startTime,
    matchDuration
  } = req.body

  const tournament = await TournamentModel.findById(tournamentID)
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
    if (event.format === EVENT.FORMAT.ROUND_ROBIN || event.format === EVENT.FORMAT.ROUND_ROBIN_CONSOLATION) {
      return arrangeMatchLib.roundRobin(event, index)
    } else if (event.format === EVENT.FORMAT.SINGLE_ELIMINATION) {
      return arrangeMatchLib.singleElim(event, index)
    }
    return []
  }))

  const sortedArrangedMatches = sortLib.minWait(arrangedMatches, numberOfCourt, matchDuration, startTime)
  // const sortedArrangedMatches = sortLib.official(arrangedMatches)

  // // arrange time 
  // // ตอนนี้ทำได้แค่จัดแข่งแบบ 2 วันจบ
  // // วันแรก group วันที่สอง knock out
  // let knockOutCount = 0
  // let i = 0
  // let j = 0
  // let skip = 0
  // let isKnockOut

  // sortedArrangedMatches.forEach((match, index) => {
  //   if (match.skip || (match.teamA && match.teamB && ((match.teamA.team && !match.teamB.team) || (match.teamB.team && !match.teamA.team)))) {
  //     match.status = 'finished'
  //     skip++
  //   } else {
  //     match.matchNumber = index + 1 - skip
  //     if (match.step === MATCH.STEP.GROUP) {
  //       match.date = moment(startTime.group).add(matchDuration.group * i, 'minutes')
  //       if (index % numberOfCourt === numberOfCourt - 1) i++
  //     } else if (match.step === MATCH.STEP.KNOCK_OUT || match.step === MATCH.STEP.CONSOLATION) {
  //       if (!isKnockOut) isKnockOut = true
  //       if (numberOfCourtKnockOut) numberOfCourt = numberOfCourtKnockOut
  //       match.date = moment(startTime.knockOut || moment(startTime.group).add(matchDuration.group * i, 'minutes'))
  //         .add(matchDuration.knockOut * j, 'minutes')
  //       knockOutCount++
  //     }

  //     if (isKnockOut && knockOutCount % numberOfCourt === 0) j++
  //   }

  // })

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

  // skip bye 
  allMatches.filter((elm) => elm.status === 'finished').forEach(async (match, index) => {
    let currentMatch
    try {
      currentMatch = await MatchModel.findByIdAndUpdate(
        match._id,
        {
          'teamA.scoreSet': match.byePosition || (match.teamA?.team ? 1 : 0),
          'teamB.scoreSet': (match.byePosition || match.byePosition === 0) ? Math.abs(match.byePosition - 1) : (match.teamB?.team ? 1 : 0),
        },
        { new: true }
      ).populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })
    } catch (error) {
      console.error('Error: Failed to update score')
      throw error
    }

    // update player in next match for knock out type
    if (currentMatch.eventID
      && currentMatch.round
      && currentMatch.round > 2 // not final round
      && (currentMatch.step === MATCH.STEP.KNOCK_OUT
        || currentMatch.step === MATCH.STEP.CONSOLATION
        || currentMatch.format === EVENT.FORMAT.SINGLE_ELIMINATION)) {
      const winTeam = match.teamA?.team ? 'teamA' : 'teamB'
      const nextMatchTeam = currentMatch.bracketOrder % 2 === 0 ? 'teamA' : 'teamB'
      try {
        await MatchModel.findOneAndUpdate(
          {
            eventID: currentMatch.eventID,
            round: currentMatch.round / 2,
            step: currentMatch.step,
            bracketOrder: Math.floor(currentMatch.bracketOrder / 2)
          },
          {
            [`${nextMatchTeam}.team`]: currentMatch[winTeam].team
          }
        )
      } catch (error) {
        console.error('Error: Failed to update next match')
        throw error
      }

    }
  })

  // return res.status(200).send(allMatches)
  return res.send(sortedArrangedMatches)

}
export default arrangeMatch