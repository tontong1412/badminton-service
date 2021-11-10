import gangCollection from '../../schema/gang'
import transaction from '../../schema/transaction'

const GangModel = gangCollection.model
const TransactionModel = transaction.model

const Stat = async (req, res) => {
  const { id } = req.params

  try {
    const gang = await GangModel.findById(id)
      .populate({
        path: 'creator players queue',
        select: ['playerID', 'displayName', 'officialName', 'shuttlecockUsed', 'status', 'scoreLabel'],
        populate: {
          path: 'playerID teamA.team teamB.team',
          populate: {
            path: 'players'
          }
        }
      })

    const transactions = await TransactionModel.find({
      gangID: id,
      reference: gang.reference
    })

    if (!gang) return res.status(404).send('gang not found')
    const totalPlayer = gang?.players?.length
    const totalShuttlecockUsed = gang?.queue?.reduce((prev, curr) => {
      return prev + curr.shuttlecockUsed
    }, 0)
    const totalMatchPlayed = gang?.queue?.length
    const totalOther = transactions.reduce((prev, curr) => {
      return prev + curr.totalOther
    }, 0)
    const totalIncome = totalOther + (totalPlayer * (gang?.courtFee.type === 'buffet' ? gang?.courtFee.amount : gang?.courtFee.amount / totalPlayer)) + (totalShuttlecockUsed * gang.shuttlecockFee * 4)

    return res.send({
      totalPlayer,
      totalShuttlecockUsed,
      totalMatchPlayed,
      totalIncome
    })

  } catch (error) {
    console.log(error)
  }
}

export default Stat