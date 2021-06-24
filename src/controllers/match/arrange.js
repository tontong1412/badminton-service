import eventCollection from '../../schema/event'
import arrangeMatchLib from '../../libs/match/arrange'
import { EVENT } from '../../constants'

const EventModel = eventCollection.model

const arrangeMatch = async (req, res) => {
  const { body } = req

  const event = await EventModel.findById(body.eventID)
  switch (event.format) {
    case EVENT.FORMAT.ROUND_ROBIN:
      arrangeMatchLib.roundRobin(event, body.qualifiedPerGroup)
  }

  return res.status(200).send(event)

}
export default arrangeMatch