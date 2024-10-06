import booking from '../../schema/booking'
import { uploadPhoto, deleteImage } from '../../libs/media'
import { CLOUDINARY } from '../../config'
import axios from 'axios'
import { BOOKING } from '../../constants'
import encryption from '../../libs/encryption'

const BookingModel = booking.model

const update = async (req, res) => {
  const { body } = req
  const { id } = req.params
  console.log(`[PUT] booking ${id}`)

  if (body.slip) {
    const booking = await BookingModel.findById(id)
      .populate({
        path: 'venue'
      })

    if (!booking) return res.status(404).send('Booking not found')

    const slipUrl = await uploadPhoto(body.slip, `${CLOUDINARY.PREFIX || ''}bookings/`, id)
    body.slip = slipUrl.url
    if (booking.venue.autoCheckSlip.enable) {
      try {
        const response = await axios.post(booking.venue.autoCheckSlip.api,
          {
            log: true,
            url: slipUrl.url,
            amount: booking.price
          },
          {
            headers: {
              "x-authorization": encryption.decrypt(booking.venue.autoCheckSlip.apiKey),
            },
          }
        )
        body.status = BOOKING.PAYMENT_STATUS.PAID
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorData = err.response.data;
          await deleteImage(`${CLOUDINARY.PREFIX || ''}bookings/${id}`)
          return res.status(400).send(errorData.message)
        }
        await deleteImage(`${CLOUDINARY.PREFIX || ''}bookings/${id}`,)
        throw err
      }
    } else {
      body.status = BOOKING.PAYMENT_STATUS.PENDING
    }
  }

  let updateResponse
  try {
    updateResponse = await BookingModel.findByIdAndUpdate(
      id,
      body,
      { new: true },
    ).populate({
      path: 'venue',
      select: { autoCheckSlip: 0 }
    }).exec()
  } catch (error) {
    console.error('Error: Failed to update event')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('event not found')
}

export default update
