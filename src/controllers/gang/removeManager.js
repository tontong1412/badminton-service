import gangCollection from '../../schema/gang'

const GangModel = gangCollection.model

const removeManager = async (req, res) => {
  const { body } = req
  // TODO: เช็คว่ามีชื่อใน match ไหนหรือเปล่าก่อนลบ

  let updateResponse
  try {
    updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $pull: { managers: body.playerID },
      },
      { new: true },
    )
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update Gang')
    throw error
  }
  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }
  return res.status(404).send('gang not found')
}

export default removeManager
