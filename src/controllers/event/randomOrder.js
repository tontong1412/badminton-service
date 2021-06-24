import eventCollection from '../../schema/event'
import randomMethod from '../../libs/event/randomOrder'
import { EVENT } from '../../constants'

const EventModel = eventCollection.model

const randomOrder = async (req, res) => {
  const { body } = req
  const event = await EventModel.findById(body.eventID)
  let order
  if (event.format === EVENT.FORMAT.ROUND_ROBIN) {
    if (event.teams < 3 * body.groupCount) return res.status(400).json({ error: 'should have at least 3 teams in 1 group' })
    const orderGroup = randomMethod.group(event.teams, body.groupCount)
    const qualifiedTeams = Array.apply(null, Array(body.qualifiedPerGroup)).reduce((prev, curr, rank) => {
      Array.apply(null, Array(body.groupCount)).forEach((val, group) => {
        prev.push(`rank ${rank + 1} of group ${group + 1}`)
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
  return res.status(200).json(order)
}

export default randomOrder
