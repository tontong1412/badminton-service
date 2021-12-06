import team from '../../schema/team'

const TeamModel = team.model

const updateteam = async (req, res) => {
  const { body, params: { id } } = req

  let updateResponse
  try {
    updateResponse = await TeamModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
  } catch (error) {
    console.error('Error: Update team had failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('team not found')
}

export default updateteam
