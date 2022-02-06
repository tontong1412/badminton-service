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
    const orderGroup = randomMethod.group(event.teams, body.groupCount)
    const qualifiedTeams = Array.apply(null, Array(body.qualifiedPerGroup)).reduce((prev, curr, rank) => {
      Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
        prev.push(`ที่ ${rank + 1} กลุ่ม ${group + 1}`)
      })
      return prev
    }, [])
    const orderKnockOut = randomMethod.knockOut(qualifiedTeams, { seeded: true, seededCount: qualifiedTeams.length })
    order = {
      group: orderGroup,
      knockOut: orderKnockOut
    }
  } else {
    order = randomMethod.knockOut(event.teams, { seeded: body.seeded, seededCount: body.seededCount })
  }

  // Todo: save to event

  const saveResponse = await EventModel.findByIdAndUpdate(
    body.eventID,
    { order },
    { new: true }
  )


  return res.status(200).json(saveResponse)
}

export default randomOrder
