import player from '../../schema/player'
import { uploadPhoto } from '../../libs/media'
import { CLOUDINARY } from '../../config'

const PlayerModel = player.model

const updatePlayer = async (req, res) => {
  const { body, params: { id } } = req

  let updateResponse
  try {
    if (body.photo) {
      const photoUrl = await uploadPhoto(body.photo, `${CLOUDINARY.PREFIX}player`, id)
      body.photo = photoUrl.url
    }
    updateResponse = await PlayerModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true },
    )
  } catch (error) {
    console.error('Error: Update player had failed')
    throw error
  }

  if (updateResponse) {
    return res.send(updateResponse.toObject())
  }

  return res.status(404).send('player not found')
}

export default updatePlayer
