import moment from "moment"

const sortMinWait = (arrangedMatches, numberOfCourt, matchDuration, startTime) => {
  // console.log(arrangedMatches)
  const totalMatchEachEvent = arrangedMatches.map(elm => elm.length)
  const totalGroupMatchEachEvent = arrangedMatches.map(event => event.filter(match => match.step === 'group').length)
  const totalKOMatchEachEvent = arrangedMatches.map(event => event.filter(match => match.step !== 'group').length)

  const totalGroupRoundEachEvent = arrangedMatches.map(event => {
    const a = event.filter(match => {
      return match.step === 'group'
    }).map(elm => elm.round)
    if (a.length === 0) a.push(0)
    return Math.max(...a)
  })

  const totalMatchPerRound = arrangedMatches.map((event, i) => {
    let a = []
    for (let j = 0; j <= totalGroupRoundEachEvent[i]; j++) {
      a.push(event.filter(match => match.step === 'group' && match.round === j).length)
    }
    return a
  })
  console.log('totalMatchEachEvent', totalMatchEachEvent)
  console.log('totalGroupMatchEachEvent', totalGroupMatchEachEvent)
  console.log('totalKOMatchEachEvent', totalKOMatchEachEvent)
  console.log('totalGroupRoundEachEvent', totalGroupRoundEachEvent)
  console.log('totalMatchPerRound', totalMatchPerRound)
  console.log('numberOfCourt', numberOfCourt)

  arrangedMatches.forEach((event, i) => {
    event.sort((a, b) => {
      if (a.eventOrder === b.eventOrder) {
        if (a.step === 'group' && b.step === 'group') {
          if (a.groupOrder === b.groupOrder) {
            return a.round - b.round
          }
          return a.groupOrder - b.groupOrder
        }
        return a.step - b.step
      }
      return a.eventOrder - b.eventOrder
    })
  })

  let timeTable = []
  let currentCourtRound = 0


  arrangedMatches.forEach((event, i) => {
    let groupStepMax = 0
    event.forEach((match, i, self) => {
      let factor
      let offset = 0
      let timeGap = 2
      let newGroup = false
      if (i > 0 && match.groupOrder !== self[i - 1].groupOrder) {
        newGroup = true
      }
      if (match.step === 'group') {
        factor = match.round
        groupStepMax = match.round
      } else {
        const maxKORound = Math.max(...event.filter(elm => elm.step !== 'group').map(elm => elm.round))
        console.log('=============', maxKORound, match.round, Math.log2(maxKORound / match.round), groupStepMax)
        factor = (Math.log2(maxKORound) - Math.log2(match.round)) + groupStepMax + 1
        timeGap = 3
      }

      while (timeTable[currentCourtRound + offset + (timeGap * factor)]?.length >= numberOfCourt) {
        offset++
      }
      if (Array.isArray(timeTable[currentCourtRound + offset + (timeGap * factor)])) {
        console.log(currentCourtRound, factor, offset, currentCourtRound + offset + (timeGap * factor))
        console.log('====================1', currentCourtRound + offset + (timeGap * factor), factor)
        console.log(match)
        timeTable[currentCourtRound + offset + (timeGap * factor)].push(match)
      } else {
        console.log('====================2', currentCourtRound + offset + (timeGap * factor), factor)
        console.log(match)
        timeTable[currentCourtRound + offset + (timeGap * factor)] = [match]
      }

      while (newGroup && timeTable[currentCourtRound]?.length >= numberOfCourt) {
        currentCourtRound++
      }

    })
  })

  let result = []
  let matchNumber = 1
  timeTable.forEach(((schedule, i) => {
    // console.log(schedule)
    schedule.forEach((match, j) => {
      match.matchNumber = matchNumber
      // console.log(i, matchDuration, i * matchDuration.group)
      match.date = moment(startTime.group).add(i * matchDuration.group, 'minutes')
      result.push(match)
      matchNumber++
    })
  }))

  // console.log(result)






  return result
}
export default sortMinWait