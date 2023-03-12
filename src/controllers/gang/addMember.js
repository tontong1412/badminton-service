import gangCollection from '../../schema/gang'


const GangModel = gangCollection.model

const addMember = async (req, res) => {
  const { body } = req
  let player = body.playerID

  try {
    const updateResponse = await GangModel.findOneAndUpdate(
      { _id: body.gangID },
      {
        $addToSet: { members: player }
      },
      { new: true },
    )
    if (updateResponse) {
      return res.send(updateResponse.toObject())
    }
    res.status(404).send('gang not found')
  } catch (error) {
    console.log(error)
    console.error('Error: Fail to update gang')
    throw error
  }
}

export default addMember
