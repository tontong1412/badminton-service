import { MATCH } from '../../../constants'
import moment from 'moment'
const officialSort = (arrangedMatches,
  numberOfCourt,
  numberOfCourtKnockOut,
  startTime,
  matchDuration) => {
  const sortedArrangedMatches = arrangedMatches.reduce((prev, curr) => {
    return [...prev, ...curr]
  }, [])

  sortedArrangedMatches.sort((a, b) => {
    if (a.step === 'group') return -1
    if (b.step === 'group') return 1
    return a.step === 'knockOut' ? 1 : -1
  })

  // sort match round robin
  sortedArrangedMatches.sort((a, b) => {
    if (a.step === 'group' || b.step === 'group') {
      if (a.step === b.step) {
        if (a.round === b.round) {
          if (a.eventOrder === b.eventOrder) {
            return a.groupOrder - b.groupOrder
          }
          return a.eventOrder - b.eventOrder
        }
        return a.round - b.round
      }
      return a.step === 'group' ? -1 : 1
    }

    if (a.round === b.round) {
      if (a.eventOrder === b.eventOrder) {
        if (a.groupOrder === b.groupOrder) {
          return a.step === 'knockOut' ? 1 : -1
        }
        return a.groupOrder - b.groupOrder
      }
      return a.eventOrder > b.eventOrder ? 1 : -1

    }
    return a.round < b.round ? 1 : -1
  })

  // arrange time 
  // ตอนนี้ทำได้แค่จัดแข่งแบบ 2 วันจบ
  // วันแรก group วันที่สอง knock out
  let knockOutCount = 0
  let i = 0
  let j = 0
  let skip = 0
  let isKnockOut

  sortedArrangedMatches.forEach((match, index) => {
    if (match.skip || (match.teamA && match.teamB && ((match.teamA.team && !match.teamB.team) || (match.teamB.team && !match.teamA.team)))) {
      match.status = 'finished'
      skip++
    } else {
      match.matchNumber = index + 1 - skip
      if (match.step === MATCH.STEP.GROUP) {
        match.date = moment(startTime.group).add(matchDuration.group * i, 'minutes')
        if (index % numberOfCourt === numberOfCourt - 1) i++
      } else if (match.step === MATCH.STEP.KNOCK_OUT || match.step === MATCH.STEP.CONSOLATION) {
        if (!isKnockOut) isKnockOut = true
        if (numberOfCourtKnockOut) numberOfCourt = numberOfCourtKnockOut
        match.date = moment(startTime.knockOut || moment(startTime.group).add(matchDuration.group * i, 'minutes'))
          .add(matchDuration.knockOut * j, 'minutes')
        knockOutCount++
      }

      if (isKnockOut && knockOutCount % numberOfCourt === 0) j++
    }

  })

  return sortedArrangedMatches
}
export default officialSort