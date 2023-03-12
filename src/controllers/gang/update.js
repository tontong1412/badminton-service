import gang from '../../schema/gang'

const GangModel = gang.model

const updateGang = async (req, res) => {
  const { body, params: { id } } = req
  console.info(`[update] gang ${id}`)

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
  } catch (error) {
    console.error('Error: Failed to update gang')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('gang not found')
}

export default updateGang
