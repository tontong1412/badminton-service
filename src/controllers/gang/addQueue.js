import moment from 'moment'
import gangCollection from '../../schema/gang'
import teamCollection from '../../schema/team'
import matchCollection from '../../schema/match'


const GangModel = gangCollection.model
const TeamModel = teamCollection.model
const MatchModel = matchCollection.model


const addQueue = async (req, res) => {
  const { body } = req
  console.info(`[addQueue] gang ${body.gangID}`)
  let teamAObject = await TeamModel.findOne({ players: { $all: body.teamA.players } })
  if (!teamAObject) {
    try {
      console.info(`[create] team from ${body.teamA.players.join(' ')}`)
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
      console.info(`[create] team from ${body.teamB.players.join(' ')}`)
      const newTeam = new TeamModel({ players: body.teamB.players })
      teamBObject = await newTeam.save()
    } catch (error) {
      console.error('Error: Fail to create team')
      throw error
    }
  }

  if (!body.force) {
    const matchExist = await MatchModel.find({
      $and: [
        {
          $or: [
            {
              $and: [
                { 'teamA.team': teamAObject._id },
                { 'teamB.team': teamBObject._id },
              ]
            },
            {
              $and: [
                { 'teamA.team': teamBObject._id },
                { 'teamB.team': teamAObject._id },
              ]
            }
          ]
        },
        { reference: body.reference },
        { gangID: body.gangID }
      ]
    })
    if (matchExist.length > 0) {
      return res.status(400).send({ message: "match exist" })
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
      date: moment().startOf('day'),
      reference: body.reference
    })
    createMatchResponse = await newMatch.save()
  } catch (error) {
    console.error('Failed to create match')
    throw error
  }

  try {
    const updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $push: { queue: createMatchResponse._id },
      },
      { new: true },
    )
    if (updateResponse) {
      return res.send(updateResponse.toObject())
    }
    return res.status(404).send('Gang not found')
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update Gang')
    throw error
  }

}

export default addQueue
