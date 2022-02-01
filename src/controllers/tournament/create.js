import tournament from '../../schema/tournament'
import playerCollection from '../../schema/player'

const TournamentModel = tournament.model
const PlayerModel = playerCollection.model

const createTournament = async (req, res) => {
  const { body, payload: { playerID } } = req

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

  const tournamentObject = new TournamentModel({
    ...body,
    creator: playerID,
    contact: contactID()
  })

  let saveResponse
  try {
    saveResponse = await tournamentObject.save()
  } catch (error) {
    console.error('Error: Failed to create tournament')
    throw error
  }

  return res.send(saveResponse.toObject())
}

export default createTournament
