import booking from '../../schema/booking'
import moment from 'moment'

const BookingModel = booking.model

const getAllBookings = async (req, res) => {
  const { query = {} } = req
  let searchOptions = {
    ...query,
  }
  if (query.date) {
    const dateString = query.date.replace(/"/g, '')
    searchOptions = {
      ...searchOptions,
      date: {
        $gte: moment(dateString).startOf('day'),
        $lt: moment(dateString).endOf('day')
      }
    }
  }

  let getAllResponse
  try {
    getAllResponse = await BookingModel.find(searchOptions)
  } catch (error) {
    console.error('Error: Failed to get bookings')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllBookings
