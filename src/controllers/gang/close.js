import gangCollection from '../../schema/gang'

const GangModel = gangCollection.model

const Close = async (req, res) => {
  const { body } = req
  // TODO: เช็คว่า status finished หมดหรือยังก่อนลบ
  try {
    const updateParams = {
      queue: [],
      $inc: { reference: 1 }
    }
    if (body.resetPlayer) {
      updateParams.players = []
    }
    await GangModel.findByIdAndUpdate(body.gangID, updateParams)
    return res.status(200).send('success')
  } catch (error) {
    console.log(error)
  }
}

export default Close