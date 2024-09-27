import venue from '../../schema/venue'

const VenueModel = venue.model

const getAllVenue = async (req, res) => {
  const { query = {} } = req
  let searchOptions = {
    ...query,
  }

  let getAllResponse
  try {
    getAllResponse = await VenueModel.find(searchOptions)
  } catch (error) {
    console.error('Error: Failed to get all gang')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllVenue
