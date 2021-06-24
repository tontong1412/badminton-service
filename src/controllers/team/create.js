import team from '../../schema/team'

const TeamModel = team.model

const createteam = async (req, res) => {
  const { body } = req

  const teamObject = new TeamModel(body)

  let saveResponse
  try {
    saveResponse = await teamObject.save()
  } catch (error) {
    console.error('Error: Failed to create team')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createteam
