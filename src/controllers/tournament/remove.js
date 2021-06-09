import mongoose from 'mongoose'
import tournament from '../../schema/tournament'

const { ObjectId } = mongoose.Types

const TournamentModel = tournament.model

const removeTournament = async (req, res) => {
  const { id } = req.params

  let removeResponse
  try {
    removeResponse = await TournamentModel.findOneAndDelete({ _id: ObjectId(id) })
  } catch (error) {
    console.error('Error: Remove tournament had failed')
    throw error
  }

  if (removeResponse) {
    return res.send(removeResponse.toObject())
  }

  return res.status(404).send('tournament not found')
}

export default removeTournament
