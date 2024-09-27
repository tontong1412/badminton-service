import venue from '../../schema/venue'

const VenueModel = venue.model

const createVenue = async (req, res) => {
  const { body, payload: { playerID } } = req

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