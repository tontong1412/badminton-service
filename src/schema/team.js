import mongoose from 'mongoose'
import { MONGO } from '../constants'

const { Schema } = mongoose

const teamSchema = new Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

teamSchema.pre('save', function (next) {
  this.model(MONGO.COLLECTION_NAME.TEAM).find({ players: { $all: this.players } }, (err, docs) => {
    if (!docs.length) {
      next()
    } else {
      next(new Error('team exists'))
    }
  })
})

const teamModel = mongoose.model(
  MONGO.COLLECTION_NAME.TEAM,
  teamSchema,
)

export default {
  model: teamModel,
  schema: teamSchema,
}
