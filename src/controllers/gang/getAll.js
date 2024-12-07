import gang from '../../schema/gang'

const GangModel = gang.model

const getAllGang = async (req, res) => {
  const { query = {} } = req
  let searchOptions = {
    ...query,
    isPrivate: false,
  }

  let getAllResponse
  try {
    getAllResponse = await GangModel.find(searchOptions)
  } catch (error) {
    console.error('Error: Failed to get all gang')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllGang
