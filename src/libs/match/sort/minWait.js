import moment from "moment"

const sortMinWait = (arrangedMatches, numberOfCourt, matchDuration, startTime, timeGap) => {
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
  // console.log('totalMatchEachEvent', totalMatchEachEvent)
  // console.log('totalGroupMatchEachEvent', totalGroupMatchEachEvent)
  // console.log('totalKOMatchEachEvent', totalKOMatchEachEvent)
  // console.log('totalGroupRoundEachEvent', totalGroupRoundEachEvent)
  // console.log('totalMatchPerRound', totalMatchPerRound)
  // console.log('numberOfCourt', numberOfCourt)

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
  let currentAvailableCourtRound = 0

  arrangedMatches.forEach((event, i) => {
    let groupStepMax = 0
    let offset = 0
    event.forEach((match, i, self) => {
      let factor
      let CurrentTimeGap = timeGap.group
      let newGroup = false
      if (i > 0 && (match.groupOrder !== self[i - 1].groupOrder || match.step !== self[i - 1].step)) {
        newGroup = true
      }
      if ((match.step === 'group') && newGroup) {
        offset = 0
        while ((match.step === 'group') && timeTable[currentAvailableCourtRound]?.length >= numberOfCourt) {
          currentAvailableCourtRound++
        }
      }

      if (match.step === 'group') {
        factor = match.round
        groupStepMax = match.round
      } else {
        const maxKORound = Math.max(...event.filter(elm => elm.step !== 'group').map(elm => elm.round))
        factor = (Math.log2(maxKORound) - Math.log2(match.round)) + groupStepMax + 1
        CurrentTimeGap = timeGap.knockOut
      }

      while (timeTable[currentAvailableCourtRound + offset + (CurrentTimeGap * factor)]?.length >= numberOfCourt) {
        offset++
      }

      if (Array.isArray(timeTable[currentAvailableCourtRound + offset + (CurrentTimeGap * factor)])) {
        timeTable[currentAvailableCourtRound + offset + (CurrentTimeGap * factor)].push(match)
      } else {
        timeTable[currentAvailableCourtRound + offset + (CurrentTimeGap * factor)] = [match]
      }

      // console.log(match)
      // console.log('currentAvailableCourtRound', currentAvailableCourtRound)
      // console.log('offset', offset)
      // console.log('CurrentTimeGap', CurrentTimeGap)
      // console.log('factor', factor)
      // console.log('calculation', currentAvailableCourtRound + offset + (CurrentTimeGap * factor))

      // console.log('==========================================')
    })

    // while (timeTable[currentAvailableCourtRound]?.length >= numberOfCourt) {
    //   currentAvailableCourtRound++
    // }
  })

  let result = []
  let matchNumber = 1
  timeTable.forEach(((schedule, i) => {
    schedule.forEach((match, j) => {
      match.matchNumber = !match.skip && matchNumber
      match.date = moment(startTime.group).add(i * matchDuration.group, 'minutes')
      result.push(match)
      if (!match.skip) matchNumber++
    })
  }))

  // console.log(result)






  return result
}
export default sortMinWait