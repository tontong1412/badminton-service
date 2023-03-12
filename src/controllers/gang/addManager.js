import gangCollection from '../../schema/gang'


const GangModel = gangCollection.model

const addManager = async (req, res) => {
  const { body } = req
  let player = body.playerID

  try {
    const updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $addToSet: { managers: player }
      },
      { new: true },
    )
    if (updateResponse) {
      return res.send(updateResponse.toObject())
    }
    res.status(404).send('Gang not found')
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update gang')
    throw error
  }
}

export default addManager
