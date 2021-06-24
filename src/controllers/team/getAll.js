import team from '../../schema/team'

const TeamModel = team.model

const getAllteam = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await TeamModel.find({})
      .populate('players').exec()
  } catch (error) {
    console.error('Error: Get all team had failed')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllteam
