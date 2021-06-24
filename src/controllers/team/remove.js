import team from '../../schema/team'

const TeamModel = team.model

const removeteam = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await TeamModel.findOneAndDelete({ _id: id })
  } catch (error) {
    console.error('Error: Remove team had failed')
    throw error
  }

  if (removeResponse) {
    return res.send(removeResponse.toObject())
  }

  return res.status(404).send('team not found')
}

export default removeteam
