import gang from '../../schema/gang'

const GangModel = gang.model

const removeGang = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await GangModel.findOneAndDelete({ _id: id })
  } catch (error) {
    console.error('Error: Remove gang had failed')
    throw error
  }

  if (removeResponse) {
    return res.send(removeResponse.toObject())
  }

  return res.status(404).send('gang not found')
}

export default removeGang
