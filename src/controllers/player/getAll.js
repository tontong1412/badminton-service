import player from '../../schema/player'

const PlayerModel = player.model

const getAllPlayer = async (req, res) => {
  let getAllResponse
  try {
    getAllResponse = await PlayerModel.find({})
    //   .populate('division.team.member').exec()
  } catch (error) {
    console.error('Error: Get all player had failed')
    throw error
  }

  return res.send(getAllResponse)
}

export default getAllPlayer
