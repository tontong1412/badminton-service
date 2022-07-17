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
    matchDuration,
    method,
    timeGap,
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

  const newEvents = tournament.events

  // // สลับมือใกล้กันแข่งห่างกัน
  // tournament.events.forEach((event, i, self) => {
  //   if (i < self.length / 2) {
  //     newEvents[2 * i] = event
  //   } else {
  //     newEvents[2 * (self.length - i) - 1] = event
  //   }
  // })

  // arrange round robin
  const arrangedMatches = await Promise.all(newEvents.map((event, index) => {
    if (event.format === EVENT.FORMAT.ROUND_ROBIN || event.format === EVENT.FORMAT.ROUND_ROBIN_CONSOLATION) {
      return arrangeMatchLib.roundRobin(event, index)
    } else if (event.format === EVENT.FORMAT.SINGLE_ELIMINATION) {
      return arrangeMatchLib.singleElim(event, index)
    }
    return []
  }))

  let sortedArrangedMatches = []

  if (method === 'official') {
    sortedArrangedMatches = sortLib.official(
      arrangedMatches,
      numberOfCourt,
      numberOfCourtKnockOut,
      startTime,
      matchDuration)
  } else if (method === 'minWait') {
    if (startTime.knockOut) {
      const groupMatches = arrangedMatches.map(event => event.filter(e => e.step === 'group'))
      const knockOutMatches = arrangedMatches.map(event => event.filter(e => e.step !== 'group'))

      const sortedGroup = sortLib.minWait(groupMatches, numberOfCourt, matchDuration, startTime.group, timeGap)
      const sortedKO = sortLib.minWait(knockOutMatches, numberOfCourtKnockOut, matchDuration, startTime.knockOut, timeGap, sortedGroup.length + 1)
      sortedArrangedMatches = [
        ...sortedGroup,
        ...sortedKO
      ]
    } else {
      sortedArrangedMatches = sortLib.minWait(arrangedMatches, numberOfCourt, matchDuration, startTime.group, timeGap)
    }

  } else if (method === 'test') {
    sortedArrangedMatches = sortLib.test(arrangedMatches, numberOfCourt, matchDuration, startTime, timeGap)
  } else {
    sortedArrangedMatches = arrangedMatches
  }



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