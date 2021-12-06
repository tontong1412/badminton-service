import match from '../../schema/match'

const MatchModel = match.model

const getMatchStat = async (req, res) => {
  const { id } = req.params

  try {
    const match = await MatchModel.findById(id)
      .populate({
        path: 'teamA.team teamB.team',
        populate: {
          path: 'players'
        }
      })

    const totalMatchPlayed = await MatchModel.find({
      status: 'finished',
      scoreLabel: { $exists: true, $ne: [] },
      $or: [
        {
          $and: [
            { 'teamA.team': match.teamA.team },
            { 'teamB.team': match.teamB.team }
          ]
        },
        {
          $and: [
            { 'teamA.team': match.teamB.team },
            { 'teamB.team': match.teamA.team }
          ]
        }
      ]
    })

    let countingResult = {
      [match.teamA.team._id]: 0,
      [match.teamB.team._id]: 0,
      tie: 0
    }

    totalMatchPlayed.forEach(curr => {
      if (curr.teamA.scoreSet > curr.teamB.scoreSet) {
        countingResult[curr.teamA.team] += 1
      } else if (curr.teamB.scoreSet > curr.teamA.scoreSet) {
        countingResult[curr.teamB.team] += 1
      } else {
        countingResult.tie += 1
      }
    })

    const response = {
      teamA: {
        players: match.teamA.team.players,
        win: countingResult[match.teamA.team._id]
      },
      teamB: {
        players: match.teamB.team.players,
        win: countingResult[match.teamB.team._id]
      },
      tie: countingResult.tie,
      totalMeet: totalMatchPlayed.length
    }
    return res.send(response)


  } catch (error) {
    console.error('Error: Failed to get match by id')
    throw error
  }
}

export default getMatchStat
