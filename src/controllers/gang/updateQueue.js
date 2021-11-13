import teamCollection from '../../schema/team'
import matchCollection from '../../schema/match'

const TeamModel = teamCollection.model
const MatchModel = matchCollection.model


const updateQueue = async (req, res) => {
  const { body } = req

  let teamAObject = await TeamModel.findOne({ players: { $all: body.teamA.players } })
  if (!teamAObject) {
    try {
      const newTeam = new TeamModel({ players: body.teamA.players })
      teamAObject = await newTeam.save()
    } catch (error) {
      console.error('Error: Fail to create team')
      throw error
    }
  }

  let teamBObject = await TeamModel.findOne({ players: { $all: body.teamB.players } })
  if (!teamBObject) {
    try {
      const newTeam = new TeamModel({ players: body.teamB.players })
      teamBObject = await newTeam.save()
    } catch (error) {
      console.error('Error: Fail to create team')
      throw error
    }
  }

  let updateMatchResponse
  try {
    updateMatchResponse = await MatchModel.findByIdAndUpdate(
      body.matchID,
      {
        'teamA.team': teamAObject._id,
        'teamB.team': teamBObject._id,
      }
    )
    res.send(updateMatchResponse)
  } catch (error) {
    console.error('Failed to update match')
    throw error
  }
}

export default updateQueue
