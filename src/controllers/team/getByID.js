import team from '../../schema/team'

const TeamModel = team.model

const getByIDteam = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await TeamModel.findById(id)
      .populate('players')
  } catch (error) {
    console.error('Error: Get by ID team had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('team not found')
}

export default getByIDteam
