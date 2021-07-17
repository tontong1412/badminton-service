import matchCollection from '../../schema/match'
import { MATCH, EVENT } from '../../constants'

const MatchModel = matchCollection.model

const setScore = async (req, res) => {
  const { matchID, score } = req.body

  // calculate score
  let scoreSetA = 0
  let scoreSetB = 0
  let scoreDiffA = 0
  let scoreDiffB = 0
  score.forEach(set => {
    const [scoreA, scoreB] = set.split('-')
    if (scoreA > scoreB) scoreSetA++
    if (scoreB > scoreA) scoreSetB++
    scoreDiffA = scoreDiffA + Number(scoreA) - Number(scoreB)
    scoreDiffB = scoreDiffB + Number(scoreB) - Number(scoreA)
  })

  let currentMatch
  try {
    currentMatch = await MatchModel.findByIdAndUpdate(
      matchID,
      {
        'teamA.scoreSet': scoreSetA,
        'teamB.scoreSet': scoreSetB,
        'teamA.scoreDiff': scoreDiffA,
        'teamB.scoreDiff': scoreDiffB,
        status: MATCH.STATUS.FINISHED,
        scoreLabel: score
      },
      { new: true }
    )
  } catch (error) {
    console.error('Error: Failed to update score')
    throw error
  }

  // update player in next match for knock out type
  if (currentMatch.round
    && currentMatch.round > 2 // not final round
    && (currentMatch.step === MATCH.STEP.KNOCK_OUT
      || currentMatch.format === EVENT.FORMAT.SINGLE_ELIMINATION)) {
    if (scoreSetA === scoreSetB) return res.status(400).send('should have winner for knock out round')
    const winTeam = scoreSetA > scoreSetB ? 'teamA' : 'teamB'
    const nextMatchTeam = currentMatch.bracketOrder % 2 === 0 ? 'teamA' : 'teamB'
    try {
      await MatchModel.findOneAndUpdate(
        {
          eventID: currentMatch.eventID,
          round: currentMatch.round / 2,
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
  return res.status(200).send(currentMatch)

}
export default setScore