import tournament from '../../schema/tournament'
import playerCollection from '../../schema/player'

const TournamentModel = tournament.model
const PlayerModel = playerCollection.model

const updateTournament = async (req, res) => {
  const { body, params: { id } } = req

  const contactID = async () => {
    const { contact } = body
    if (!contact) return null
    if (contact._id) {
      await PlayerModel.findByIdAndUpdate(contact._id, contact)
      return contact._id
    }
    const playerResponse = await PlayerModel.findOneAndUpdate({ displayName: contact.name }, contact)
    if (playerResponse) return playerResponse._id
    try {
      const playerObject = new PlayerModel({
        ...contact,
        officialName: contact.name
      })
      const saveResponse = await playerObject.save()
      return saveResponse._id
    } catch (error) {
      console.error('Error: Fail to create player')
      throw error
    }
  }
  const contactId = await contactID()
  if (contactId) {
    body.contact = contactId
  }

  let updateResponse
  try {
    updateResponse = await TournamentModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
  } catch (error) {
    console.error('Error: Update tournament had failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('tournament not found')
}

export default updateTournament
