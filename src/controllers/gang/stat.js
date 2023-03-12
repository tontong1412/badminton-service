import gangCollection from '../../schema/gang'
import transaction from '../../schema/transaction'

const GangModel = gangCollection.model
const TransactionModel = transaction.model

const Stat = async (req, res) => {
  const { id } = req.params
  console.info(`[stat] gang ${id}`)
  const gang = await GangModel.findById(id)
    .populate({
      path: 'queue',
      select: 'shuttlecockUsed',
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

}

export default Stat