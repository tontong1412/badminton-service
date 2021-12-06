import gangCollection from '../../schema/gang'
import transactionCollection from '../../schema/transaction'

const GangModel = gangCollection.model
const TransactionModel = transactionCollection.model

const getBill = async (req, res) => {
  const { params } = req

  const gang = await GangModel.findById(params.id)

  const response = await TransactionModel.find(
    {
      gangID: gang._id,
      reference: gang.reference
    }
  ).populate('reciever payer')
  return res.json(response)
}
export default getBill