import mongoose from 'mongoose'
import { MATCH } from '../../../constants'

const { ObjectId } = mongoose.Types

const arrangeSingleElimination = (event, eventOrder) => {
  const { order } = event
  let arrangedMatches = []
  // knockout
  const totalRound = Math.log2(order.singleElim.length)
  const tempKnockOutTeam = order.singleElim
  for (let i = 0; i < totalRound; i++) {
    const knockOutTeam = [...tempKnockOutTeam]
    tempKnockOutTeam.length = 0
    knockOutTeam.forEach((team, index, self) => {
      if (index % 2 === 1) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          eventName: event.name,
          format: event.format,
          level: event.level,
          teamA: self[index - 1]?.hasOwnProperty('teamA') ? null : { team: self[index - 1] },
          teamB: self[index]?.hasOwnProperty('teamA') ? null : { team: self[index] },
          step: MATCH.STEP.KNOCK_OUT,
          round: Math.pow(2, totalRound - i),
          eventOrder,
          bracketOrder: (index - 1) / 2
        })
        tempKnockOutTeam.push({ teamA: null, teamB: null })
      }
    })
  }
  return arrangedMatches
}
export default arrangeSingleElimination