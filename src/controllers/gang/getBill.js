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

  const [gang, teamsDoc] = await Promise.all(findPromiseALL)
  const teams = teamsDoc.map(elm => elm._id)
  const matches = await MatchModel.find({
    gangID: query.gangID,
    reference: gang.reference,
    $or: [
      { 'teamA.team': { $in: teams } },
      { 'teamB.team': { $in: teams } },
    ],
  })

  const courtFee = gang.courtFee.type === GANG.COURT_FEE_TYPE.BUFFET
    ? gang.courtFee.amount
    : Math.ceil(gang.courtFee.amount / gang.players.length)

  const shuttlecockUsed = matches.reduce((prev, curr) => {
    return prev + curr.shuttlecockUsed
  }, 0)

  const shuttlecockTotal = shuttlecockUsed * gang.shuttlecockFee

  const findExist = await TransactionModel.findOne({
    gangID: query.gangID,
    payer: query.playerID,
    reference: gang.reference
  })

  let totalOther = 0

  if (findExist) {
    totalOther = findExist.other?.reduce((prev, curr) => {
      return prev + curr.amount
    }, totalOther)
  }
  const total = courtFee + shuttlecockTotal + totalOther

  const response = await TransactionModel.findByIdAndUpdate(findExist?._id,
    {
      gangID: query.gangID,
      courtFee,
      shuttlecockUsed,
      shuttlecockFee: gang.shuttlecockFee,
      shuttlecockTotal,
      total,
      reciever: gang.creator,
      payer: query.playerID,
      payment: gang.payment,
      date: moment().startOf('day'),
      reference: gang.reference,
      matches: matches.map(elm => elm._id),
      totalOther,
    },
    {
      upsert: true,
      returnNewDocument: true,
      new: true
    }
  ).populate({
    path: 'reciever payer matches',
    populate: {
      path: 'teamA.team teamB.team',
      populate: 'players'
    }
  })
  return res.json(response)
}
export default getBill