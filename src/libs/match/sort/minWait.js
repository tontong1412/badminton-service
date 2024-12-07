import moment from "moment"

const sortMinWait = async (arrangedMatches, numberOfCourt, matchDuration, startTime, timeGap, startMatchNumber = 1, eventOrder = null) => {
  let newArrangedMatches = [...arrangedMatches]
  if (eventOrder) {
    for (let i = 0; i < eventOrder.length; i++) {
      const index = arrangedMatches.findIndex(e => e[0].eventID == eventOrder[i])
      newArrangedMatches[i] = [...arrangedMatches[index]]
    }
    // newArrangedMatches = await Promise.all(eventOrder.map(eventID => {
    //   const index = arrangedMatches.findIndex(e => e[0].eventID == eventID)
    //   console.log('index', index)
    //   return [...arrangedMatches[index]]
    // }))
  }

  newArrangedMatches.forEach((event, i) => {
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
  let skipMatch = []
  let currentAvailableCourtRound = 0

  newArrangedMatches.forEach((event, i) => {
    let groupStepMax = 0
    let offset = 0
    const eventSkipMatch = event.filter(match => match.skip === true)
    skipMatch = [...skipMatch, ...eventSkipMatch]
    event.filter(e => e.skip !== true).forEach((match, i, self) => {
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

        // ถ้ามีแต่รอบ knockout
        if (groupStepMax === 0) {
          factor -= 1
        }
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
  let matchNumber = startMatchNumber
  timeTable.forEach(((schedule, i) => {
    schedule.forEach((match, j) => {
      match.matchNumber = !match.skip && matchNumber
      const currentMatchDuration = match.step === 'group' ? matchDuration.group : matchDuration.knockOut
      match.date = moment(startTime).add(i * currentMatchDuration, 'minutes')
      result.push(match)
      if (!match.skip) matchNumber++
    })
  }))
  result = [...result, ...skipMatch]

  return result
}
export default sortMinWait
