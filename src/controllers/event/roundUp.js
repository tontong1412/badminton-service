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
      const currentMatch = await MatchModel.findOneAndUpdate(
        {
          eventID,
          step: step,
          round: order.length,
          bracketOrder: Math.floor(i / 2)
        },
        {
          [`${teamOrder}.team`]: order[i]
        },
        { new: true }
      )
      console.log(currentMatch)
      if (currentMatch.status === 'finished'
        && currentMatch.eventID
        && currentMatch.round
        && currentMatch.round > 2 // not final round
        && (currentMatch.step === MATCH.STEP.KNOCK_OUT
          || currentMatch.step === MATCH.STEP.CONSOLATION
          || currentMatch.format === EVENT.FORMAT.SINGLE_ELIMINATION)) {
        const winTeam = currentMatch.teamA.scoreSet > currentMatch.teamB.scoreSet ? 'teamA' : 'teamB'
        const nextMatchTeam = currentMatch.bracketOrder % 2 === 0 ? 'teamA' : 'teamB'
        try {
          await MatchModel.findOneAndUpdate(
            {
              eventID: currentMatch.eventID,
              round: currentMatch.round / 2,
              step: currentMatch.step,
              bracketOrder: Math.floor(currentMatch.bracketOrder / 2)
            },
            {
              [`${nextMatchTeam}.team`]: currentMatch[winTeam].team
            }
          )
        } catch (error) {
          console.error('Error: Failed to update next match')
          throw error
        }

      }
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