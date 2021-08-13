import gang from '../../schema/gang'

const GangModel = gang.model

const createGang = async (req, res) => {
  const { body, payload: { playerID } } = req

  const gangObject = new GangModel({ ...body, creator: playerID })

  let saveResponse
  try {
    saveResponse = await gangObject.save()
  } catch (error) {
    console.error('Error: Failed to create gang')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createGang
