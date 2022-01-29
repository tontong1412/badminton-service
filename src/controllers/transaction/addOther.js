import transactionCollection from '../../schema/transaction'

const TransactionModal = transactionCollection.model

const addOther = async (req, res) => {
  const { body, params } = req

  const totalAmount = body.reduce((prev, curr) => {
    return prev + curr.amount
  }, 0)
  let updateResponse
  try {
    updateResponse = await TransactionModal.findOneAndUpdate(
      { _id: params.id },
      {
        $addToSet: { other: { $each: body } },
        $inc: {
          'totalOther': totalAmount,
          'total': totalAmount
        }
      },
      { new: true },
    )
      .populate({
        path: 'reciever payer matches',
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
  return res.status(404).send('transaction not found')
}

export default addOther
