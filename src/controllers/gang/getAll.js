import gang from '../../schema/gang'

const GangModel = gang.model

const getAllGang = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await GangModel.find({})
      .populate({
        path: 'creator players',
        select: ['playerID', 'displayName', 'officialName'],
        populate: {
          path: 'playerID'
        }
      })
  } catch (error) {
    console.error('Error: Failed to get all gang')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllGang
