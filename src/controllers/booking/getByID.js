import booking from '../../schema/booking'

const BookingModel = booking.model

const getByID = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await BookingModel.findById(id)
      .populate({
        path: 'venue',
        select: { autoCheckSlip: 0, }
      })
  } catch (error) {
    console.error('Error: Get by ID player had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('booking not found')
}

export default getByID
