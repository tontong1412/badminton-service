import gangCollection from '../../schema/gang'

const GangModel = gangCollection.model

const Close = async (req, res) => {
  const { body } = req
  // TODO: เช็คว่า status finished หมดหรือยังก่อนลบ
  try {
    await GangModel.findByIdAndUpdate(body.gangID, {
      queue: [],
      players: [],
      $inc: { 'reference': 1 }
    })
    return res.status(200).send('success')
  } catch (error) {
    console.log(error)
  }
}

export default Close