import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

const arrangeMatchRoundRobin = (event, qualifiedPerGroup, { groupPlayTime = 20, knockOutPlayTime = 30 } = {}) => {
  const { order } = event

  let arrangedMatches = []
  let maxRoundOnFirstStage = 0

  order.group.forEach((groupObj, groupIndex) => {
    const tempGroupObj = groupObj
    if (tempGroupObj.length % 2 === 1) {
      tempGroupObj.unshift({ // add dummy player
        players: [],
      })
    }

    const totalRound = tempGroupObj.length - 1
    if (maxRoundOnFirstStage < totalRound) {
      maxRoundOnFirstStage = totalRound
    }

    const standTeam = tempGroupObj[0]
    const roundRobinTeam = tempGroupObj.slice(1, tempGroupObj.length)

    for (let round = 0; round < totalRound; round++) {
      if (standTeam.players && standTeam.players.length) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          format: event.format,
          level: event.level,
          teamA: roundRobinTeam[roundRobinTeam.length - 1],
          teamB: standTeam,
          round,
          orderNumber: groupIndex,
        })
      }

      for (let j = 0; j < (roundRobinTeam.length - 1) / 2; j++) {
        arrangedMatches.push({
          eventID: ObjectId(event._id),
          format: event.format,
          level: event.level,
          teamA: roundRobinTeam[roundRobinTeam.length - 2 - j],
          teamB: roundRobinTeam[j],
          round,
          orderNumber: groupIndex,
        })
      }

      const lastRoundRobinTeam = roundRobinTeam.pop()
      roundRobinTeam.unshift(lastRoundRobinTeam)
    }
  })

  console.log(arrangedMatches)
}
export default arrangeMatchRoundRobin