import matchCollection from '../../schema/match'
import { MATCH, TOURNAMENT } from '../../constants'
import eventCollection from '../../schema/event'
import tournamentCollection from '../../schema/tournament'

const MatchModel = matchCollection.model
const EventModel = eventCollection.model
const TournamentModel = tournamentCollection.model

const roundUp = async (req, res) => {
  const { eventID, order, step = MATCH.STEP.KNOCK_OUT } = req.body
  try {
    for (let i = 0; i < order.length; i++) {
      const teamOrder = i % 2 === 0 ? 'teamA' : 'teamB'
      await MatchModel.updateMany(
        {
          eventID,
          step: step,
          round: order.length,
          bracketOrder: Math.floor(i / 2)
        },
        {
          [`${teamOrder}.team`]: order[i]
        }
      )
    }
  } catch (error) {
    console.error('Error: Failed to update match')
    throw error
  }

  let event
  try {
    event = await EventModel.findByIdAndUpdate(eventID, { step: MATCH.STEP.KNOCK_OUT })
  } catch (error) {
    console.log('Error: Failed to update event')
    throw error
  }

  // มั่ว
  const eventGroupStep = await EventModel.find({ tournamentID: event.tournamentID, step: MATCH.STEP.GROUP })
  if (!eventGroupStep.length) {
    try {
      await TournamentModel.findByIdAndUpdate(event.tournamentID, { status: TOURNAMENT.STATUS.KNOCKOUT })
    } catch (error) {
      console.log('Error: Failed to update tournament')
      throw error
    }
  }


  let response
  try {
    response = await MatchModel.find({
      eventID,
      step: MATCH.STEP.KNOCK_OUT
    }).populate({
      path: 'teamA.team teamB.team',
      populate: {
        path: 'players'
      }
    })
  } catch (error) {
    console.error('Error: Failed to get match for response')
    throw error
  }

  return res.status(200).send(response)

}
export default roundUp