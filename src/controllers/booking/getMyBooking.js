import booking from '../../schema/booking'
import moment from 'moment'
import venue from '../venue'

const BookingModel = booking.model

const getMyBooking = async (req, res) => {
  const { payload, query = {} } = req
  let searchOptions = {
    ...query,
  }
  searchOptions = {
    ...searchOptions,
    date: {
      $gte: moment().subtract(1, 'day').startOf('day'),
    },
    playerID: payload.playerID,
    isCustomer: true
  }


  let getAllResponse
  try {
    getAllResponse = await BookingModel.find(searchOptions)
      .sort({ 'date': 1 })
      .populate({
        path: 'venue',
        select: 'name'
      })
  } catch (error) {
    console.error('Error: Failed to get bookings')
    throw error
  }

  return res.send(getAllResponse)
}

export default getMyBooking
