import eventCollection from '../../schema/event'
import randomMethod from '../../libs/event/randomOrder'
import { EVENT } from '../../constants'

const EventModel = eventCollection.model

const randomOrder = async (req, res) => {
  const { body } = req
  const event = await EventModel.findById(body.eventID, { 'teams.status': false, 'teams.paymentStatus': false })
  // .populate({
  //   path: 'teams.team',
  //   populate: {
  //     path: 'players'
  //   }
  // })
  let order
  if (event.format === EVENT.FORMAT.ROUND_ROBIN) {
    if (event.teams < 3 * body.groupCount) return res.status(400).json({ error: 'should have at least 3 teams in 1 group' })

    let orderGroup
    if (body.groupOrder) {
      orderGroup = body.groupOrder
    } else {
      orderGroup = randomMethod.group(event.teams, body.groupCount)
    }

    // for random knockout draw
    const qualifiedTeams = Array.apply(null, Array(Math.floor(body.qualified / body.groupCount))).reduce((prev, curr, rank) => {
      Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
        prev.push(`ที่ ${rank + 1} กลุ่ม ${EVENT.GROUP_NAME[group].NAME}`)
      })
      return prev
    }, [])
    while (qualifiedTeams.length < body.qualified) {
      qualifiedTeams.push('ที่ X กลุ่ม X')
    }
    const orderKnockOut = randomMethod.knockOut(qualifiedTeams, { seeded: true, seededCount: Math.pow(2, Math.floor(Math.log2(qualifiedTeams.length))) })

    // // not random knockout draw put dummy
    // const qualifiedTeams = Array.apply(null, Array(body.qualified)).map(() => 'รอผลรอบแบ่งกลุ่ม')
    // const orderKnockOut = randomMethod.knockOut(qualifiedTeams)

    order = {
      group: orderGroup,
      knockOut: orderKnockOut
    }
  } else if (event.format === EVENT.FORMAT.ROUND_ROBIN_CONSOLATION) {
    if (event.teams < 3 * body.groupCount) return res.status(400).json({ error: 'should have at least 3 teams in 1 group' })

    let orderGroup
    if (body.groupOrder) {
      orderGroup = body.groupOrder
    } else {
      orderGroup = randomMethod.group(event.teams, body.groupCount)
    }

    // for random knockout draw
    // const qualifiedTeams = Array.apply(null, Array(body.qualifiedPerGroup)).reduce((prev, curr, rank) => {
    //   Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
    //     prev.push(`ที่ ${rank + 1} กลุ่ม ${group + 1}`)
    //   })
    //   return prev
    // }, [])
    // const orderKnockOut = randomMethod.knockOut(qualifiedTeams, { seeded: true, seededCount: qualifiedTeams.length })

    // for random knockout draw
    let maindrawRank = 1
    const qualifiedTeams = Array.apply(null, Array(Math.floor(body.qualified / body.groupCount))).reduce((prev, curr, rank) => {
      Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
        prev.push(`ที่ ${rank + 1} กลุ่ม ${EVENT.GROUP_NAME[group].NAME}`)
      })
      maindrawRank++
      return prev
    }, [])
    while (qualifiedTeams.length < body.qualified) {
      qualifiedTeams.push('ที่ X กลุ่ม X')
    }
    const orderKnockOut = randomMethod.knockOut(qualifiedTeams, { seeded: true, seededCount: Math.pow(2, Math.floor(Math.log2(qualifiedTeams.length))) })

    const consolationTeams = Array.apply(null, Array(Math.floor(body.qualifiedConsolation / body.groupCount))).reduce((prev, curr, rank) => {
      Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
        prev.push(`ที่ ${rank + maindrawRank} กลุ่ม ${EVENT.GROUP_NAME[group].NAME}`)
      })
      return prev
    }, [])
    while (consolationTeams.length < body.qualifiedConsolation) {
      consolationTeams.push('ที่ X กลุ่ม X')
    }
    const orderConsolation = randomMethod.knockOut(consolationTeams, { seeded: true, seededCount: Math.pow(2, Math.floor(Math.log2(consolationTeams.length))) })




    // const qualifiedTeams = Array.apply(null, Array(body.qualified)).map(() => 'รอผลรอบแบ่งกลุ่ม')
    // const orderKnockOut = randomMethod.knockOut(qualifiedTeams)

    // const consolationTeams = Array.apply(null, Array(body.qualifiedConsolation)).map(() => 'รอผลรอบแบ่งกลุ่ม')
    // const orderConsolation = randomMethod.knockOut(consolationTeams)

    order = {
      group: orderGroup,
      knockOut: orderKnockOut,
      consolation: orderConsolation
    }
  }
  else {
    order = {
      singleElim: body.order || randomMethod.knockOut(event.teams, { seeded: body.seeded, seededCount: body.seededCount })
    }
  }

  const saveResponse = await EventModel.findByIdAndUpdate(
    body.eventID,
    { order },
    { new: true }
  )


  return res.status(200).json(saveResponse)
}

export default randomOrder
