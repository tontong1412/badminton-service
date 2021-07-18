import moment from 'moment'
import gangCollection from '../../schema/gang'
import teamCollection from '../../schema/team'
import matchCollection from '../../schema/match'


const GangModel = gangCollection.model
const TeamModel = teamCollection.model
const MatchModel = matchCollection.model


const addQueue = async (req, res) => {
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

  let createMatchResponse
  try {
    const newMatch = new MatchModel({
      gangID: body.gangID,
      teamA: {
        team: teamAObject._id
      },
      teamB: {
        team: teamBObject._id
      },
      date: moment()
    })
    createMatchResponse = await newMatch.save()
  } catch (error) {
    console.error('Failed to create match')
    throw error
  }

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $push: { queue: createMatchResponse._id },
      },
      { new: true },
    )
      .populate({
        path: 'queue',
        populate: {
          path: 'teamA.team teamB.team',
          populate: 'players'
        }
      })
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update Gang')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('gang not found')
}

export default addQueue
