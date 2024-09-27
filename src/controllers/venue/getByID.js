import venue from '../../schema/venue'

const VenueModel = venue.model

const getByIDVenue = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await VenueModel.findById(id)
  } catch (error) {
    console.error('Error: Get by ID player had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('venue not found')
}

export default getByIDVenue
