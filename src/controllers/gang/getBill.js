import moment from 'moment'
import matchCollection from '../../schema/match'
import gangCollection from '../../schema/gang'
import teamCollection from '../../schema/team'
import transactionCollection from '../../schema/transaction'
import { GANG } from '../../constants'

const MatchModel = matchCollection.model
const GangModel = gangCollection.model
const TeamModel = teamCollection.model
const TransactionModel = transactionCollection.model

const getBill = async (req, res) => {
  const { query } = req

  const findPromiseALL = [GangModel.findById(query.gangID), TeamModel.find({ players: query.playerID })]

  // const gang = await GangModel.findById(query.gangID)
  // const teamsDoc = await TeamModel.find({ players: query.playerID })
  const [gang, teamsDoc] = await Promise.all(findPromiseALL)
  const teams = teamsDoc.map(elm => elm._id)
  const matches = await MatchModel.find({
    gangID: query.gangID,
    date: moment().startOf('day'),
    $or: [
      { 'teamA.team': { $in: teams } },
      { 'teamB.team': { $in: teams } },
    ],
  })

  const courtFee = gang.courtFee.type === GANG.COURT_FEE_TYPE.BUFFET
    ? gang.courtFee.amount
    : gang.courtFee.amount / gang.players.length

  const shuttlecockUsed = matches.reduce((prev, curr) => {
    return prev + curr.shuttlecockUsed
  }, 0)

  const total = courtFee + (shuttlecockUsed * gang.shuttlecockFee)

  const response = await TransactionModel.findOneAndUpdate(
    {
      gangID: query.gangID,
      payer: query.playerID,
      date: moment().startOf('day')
    },
    {
      gangID: query.gangID,
      courtFee,
      shuttlecockUsed,
      total,
      reciever: gang.creator,
      payer: query.playerID,
      payment: gang.payment,
      date: moment().startOf('day')
    },
    {
      upsert: true,
      returnNewDocument: true,
      new: true
    }
  ).populate('reciever payer')
  return res.json(response)
}
export default getBill