import venue from '../../schema/venue'
import encryption from '../../libs/encryption'

const VenueModel = venue.model

const createVenue = async (req, res) => {
  const { body, payload: { playerID } } = req

  if (body.autoCheckSlip.enable) {
    const encryptedAPIKey = encryption.encrypt(body.autoCheckSlip.apiKey)
    console.log(encryptedAPIKey)
    body.autoCheckSlip.apiKey = encryptedAPIKey
  }

  const venueObject = new VenueModel({ ...body, creator: playerID })

  let saveResponse
  try {
    saveResponse = await venueObject.save()
  } catch (error) {
    console.error('Error: Failed to create venue')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createVenue