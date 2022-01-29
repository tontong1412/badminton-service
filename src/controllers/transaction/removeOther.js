import transactionCollection from '../../schema/transaction'

const TransactionModal = transactionCollection.model

const removeOther = async (req, res) => {
  const { body, params } = req

  let updateResponse
  try {
    updateResponse = await TransactionModal.findOneAndUpdate(
      { _id: params.id },
      {
        $pull: { other: body.other },
        $inc: {
          'totalOther': 0 - body.other.amount,
          'total': 0 - body.other.amount
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

export default removeOther
