import transaction from '../../schema/transaction'
import { uploadPhoto } from '../../libs/media'
import { CLOUDINARY } from '../../config'

const TransactionModel = transaction.model

const updatetransaction = async (req, res) => {
  const { body, params: { id } } = req

  if (body.slip) {
    const slipUrl = await uploadPhoto(body.slip, `${CLOUDINARY.PREFIX || ''}transaction`, id)
    body.slip = slipUrl.url
  }

  let updateResponse
  try {
    updateResponse = await TransactionModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    ).populate({
      path: 'reciever payer matches',
      populate: {
        path: 'teamA.team teamB.team',
        populate: 'players'
      }
    })
  } catch (error) {
    console.error('Error: Update transaction failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('transaction not found')
}

export default updatetransaction
