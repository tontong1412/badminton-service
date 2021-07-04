import mongoose from 'mongoose'
import { MATCH } from '../../../constants'

const { ObjectId } = mongoose.Types

const arrangeMatchRoundRobin = (event, eventOrder, qualifiedPerGroup, { groupPlayTime = 20, knockOutPlayTime = 30 } = {}) => {
  const { order } = event

  let arrangedMatches = []
  let maxRoundOnFirstStage = 0

  order.group.forEach((groupObj, groupIndex) => {
    const tempGroupObj = groupObj
    if (tempGroupObj.length % 2 === 1) { // add dummy player
      tempGroupObj.unshift({
        team: { players: [] },
      })
    }

    const totalRound = tempGroupObj.length - 1
    if (maxRoundOnFirstStage < totalRound) {
      maxRoundOnFirstStage = totalRound
    }

    const standTeam = tempGroupObj[0]
    const roundRobinTeam = tempGroupObj.slice(1, tempGroupObj.length)

    for (let round = 0; round < totalRound; round++) {
      if (standTeam.team.players && standTeam.team.players.length) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          format: event.format,
          level: event.level,
          teamA: roundRobinTeam[roundRobinTeam.length - 1],
          teamB: standTeam,
          step: MATCH.STEP.GROUP,
          round,
          groupOrder: groupIndex,
          eventOrder,
        })
      }

      for (let j = 0; j < (roundRobinTeam.length - 1) / 2; j++) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          format: event.format,
          level: event.level,
          teamA: roundRobinTeam[roundRobinTeam.length - 2 - j],
          teamB: roundRobinTeam[j],
          step: MATCH.STEP.GROUP,
          round,
          groupOrder: groupIndex,
          eventOrder,
        })
      }

      const lastRoundRobinTeam = roundRobinTeam.pop()
      roundRobinTeam.unshift(lastRoundRobinTeam)
    }
  })

  const totalRound = Math.log2(order.knockOut.length)
  const tempKnockOutTeam = order.knockOut
  const knockOutMatch = []
  for (let i = 0; i < totalRound; i++) {
    const knockOutTeam = [...tempKnockOutTeam]
    tempKnockOutTeam.length = 0
    knockOutTeam.forEach((team, index, self) => {
      if (index % 2 === 1) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          format: event.format,
          level: event.level,
          teamA: null,
          teamB: null,
          step: MATCH.STEP.KNOCK_OUT,
          round: Math.pow(2, totalRound - i),
        })
        tempKnockOutTeam.push({ teamA: null, teamB: null })
      }
    })

  }
  return arrangedMatches
  // return knockOutMatch
}
export default arrangeMatchRoundRobin