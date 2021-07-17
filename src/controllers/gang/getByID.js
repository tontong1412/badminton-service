import gang from '../../schema/gang'

const GangModel = gang.model

const getByIDGang = async (req, res) => {
  const { id } = req.params

  let getByIDResponse
  try {
    getByIDResponse = await GangModel.findById(id)
  } catch (error) {
    console.error('Error: Get by ID gang had failed')
    throw error
  }

  if (getByIDResponse) {
    return res.send(getByIDResponse)
  }

  return res.status(404).send('gang not found')
}

export default getByIDGang
