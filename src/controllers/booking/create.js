import { BOOKING } from '../../constants';
import booking from '../../schema/booking'
import encryption from '../../libs/encryption'

const BookingModel = booking.model

const create = async (req, res) => {
  const { body, payload: { playerID } } = req

  // Create an array of $elemMatch conditions
  const conditions = body.slots.map(slot => ({
    slots: {
      $elemMatch: {
        'court._id': slot.court._id,
        time: slot.time
      }
    }
  }));

  // check if the requested slots are available
  const findExistBooking = await BookingModel.findOne({
    venue: body.venue,
    date: body.date,
    status: { $ne: BOOKING.PAYMENT_STATUS.EXPIRED },
    $or: conditions
  })
  if (!findExistBooking) {
    const bookingObject = new BookingModel({ ...body, playerID, bookingRef: encryption.generateID() })
    let saveResponse
    try {
      saveResponse = await bookingObject.save()
    } catch (error) {
      console.error('Error: Failed to book courts')
      throw error
    }
    return res.send(saveResponse.toObject())
  }

  return res.status(400).send('One or more slots you have chosen are not available anymore')

}

export default create