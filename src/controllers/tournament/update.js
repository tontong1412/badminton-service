import tournament from '../../schema/tournament'
import playerCollection from '../../schema/player'
import { uploadPhoto } from '../../libs/media'
import { CLOUDINARY } from '../../config'

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
    const playerResponse = await PlayerModel.findOneAndUpdate({ officialName: contact.name }, contact)
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

  if (body.logo && body.logo.match(/http:\/\/res.cloudinary.com\/badminstar/g).length === 0) {
    const photoUrl = await uploadPhoto(body.logo, `${CLOUDINARY.PREFIX}tournament/logo`, id)
    body.logo = photoUrl.url
  }
  if (body.poster && body.poster.match(/http:\/\/res.cloudinary.com\/badminstar/g).length === 0) {
    const photoUrl = await uploadPhoto(body.poster, `${CLOUDINARY.PREFIX}tournament/poster`, id)
    body.poster = photoUrl.url
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
