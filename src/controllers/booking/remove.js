import booking from '../../schema/booking'

const BookingModel = booking.model

const removeBooking = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await BookingModel.findOneAndDelete({ _id: id })
  } catch (error) {
    console.error('Error: Remove booking had failed')
    throw error
  }

  if (removeResponse) {
    return res.send(removeResponse.toObject())
  }

  return res.status(404).send('booking not found')
}

export default removeBooking
