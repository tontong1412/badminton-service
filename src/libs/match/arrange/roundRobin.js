import mongoose from 'mongoose'
import { MATCH } from '../../../constants'

const { ObjectId } = mongoose.Types

const arrangeMatchRoundRobin = (event, eventOrder, eventOrderKO) => {
  const { order } = event

  let arrangedMatches = []
  let maxRoundOnFirstStage = 0

  order.group.forEach((groupObj, groupIndex) => {
    const tempGroupObj = groupObj
    if (tempGroupObj.length % 2 === 1) { // add dummy player
      tempGroupObj.unshift(null)
    }

    const totalRound = tempGroupObj.length - 1
    if (maxRoundOnFirstStage < totalRound) {
      maxRoundOnFirstStage = totalRound
    }

    const standTeam = tempGroupObj[0]
    const roundRobinTeam = tempGroupObj.slice(1, tempGroupObj.length)

    for (let round = 0; round < totalRound; round++) {
      if (standTeam) {
        arrangedMatches.push({
          eventID: new ObjectId(event._id),
          eventName: event.name,
          format: event.format,
          level: event.level,
          teamA: { team: roundRobinTeam[roundRobinTeam.length - 1] },
          teamB: { team: standTeam },
          step: MATCH.STEP.GROUP,
          round,
          groupOrder: groupIndex,
          eventOrder,
        })
      }

      for (let j = 0; j < (roundRobinTeam.length - 1) / 2; j++) {
        arrangedMatches.push({
          eventID: new ObjectId(event._id),
          eventName: event.name,
          format: event.format,
          level: event.level,
          teamA: { team: roundRobinTeam[roundRobinTeam.length - 2 - j] },
          teamB: { team: roundRobinTeam[j] },
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


  // knockout
  const totalRound = Math.log2(order.knockOut.length)
  const tempKnockOutTeam = order.knockOut
  for (let i = 0; i < totalRound; i++) {
    const knockOutTeam = [...tempKnockOutTeam]
    tempKnockOutTeam.length = 0
    knockOutTeam.forEach((team, index, self) => {
      if (index % 2 === 1) {
        arrangedMatches.push({
          eventID: new ObjectId(event._id),
          eventName: event.name,
          format: event.format,
          level: event.level,
          teamA: null,
          teamB: null,
          step: MATCH.STEP.KNOCK_OUT,
          round: Math.pow(2, totalRound - i),
          eventOrder: eventOrderKO || eventOrder,
          bracketOrder: (index - 1) / 2,
          skip: self[index] === null || self[index - 1] === null,
          status: (self[index] === null || self[index - 1] === null) ? 'finished' : 'waiting',
          byePosition: self[index - 1] ? 1 : 0
        })
        tempKnockOutTeam.push({ teamA: null, teamB: null })
      }
    })
  }

  // consolation
  if (event.format === 'roundRobinConsolation') {
    const totalRoundConsolation = Math.log2(order.consolation.length)
    const tempConsolationTeam = order.consolation
    for (let i = 0; i < totalRoundConsolation; i++) {
      const consolationTeam = [...tempConsolationTeam]
      tempConsolationTeam.length = 0
      consolationTeam.forEach((team, index, self) => {
        if (index % 2 === 1) {
          arrangedMatches.push({
            eventID: new ObjectId(event._id),
            eventName: event.name,
            format: event.format,
            level: event.level,
            teamA: null,
            teamB: null,
            step: MATCH.STEP.CONSOLATION,
            round: Math.pow(2, totalRoundConsolation - i),
            eventOrder: eventOrderKO || eventOrder,
            bracketOrder: (index - 1) / 2,
            skip: self[index] === null || self[index - 1] === null,
            status: (self[index] === null || self[index - 1] === null) ? 'finished' : 'waiting',
            byePosition: self[index - 1] ? 1 : 0
          })
          tempConsolationTeam.push({ teamA: null, teamB: null })
        }
      })
    }
  }

  return arrangedMatches
}
export default arrangeMatchRoundRobin