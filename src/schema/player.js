import mongoose from 'mongoose'
import { MONGO, PLAYER } from '../constants'

const SchemaModel = mongoose.Schema
const { Schema } = mongoose

const playerSchema = new Schema({
  officialName: { type: String, trim: true },
  displayName: { type: String, trim: true },
  club: { type: String, trim: true },
  gender: {
    type: String,
    trim: true,
    enum: [
      PLAYER.GENDER.MALE,
      PLAYER.GENDER.FEMALE,
    ],
  },
  birthDate: Date,
  userID: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.USER },
  photo: String,
  lineID: String,
  tel: String
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

playerSchema.pre('save', function (next) {
  if (!this.officialName) next()
  this.model(MONGO.COLLECTION_NAME.PLAYER).find({ officialName: this.officialName }, (err, docs) => {
    if (!docs.length) {
      next()
    } else {
      next(new Error('user exists'))
    }
  })
})

const playerModel = mongoose.model(
  MONGO.COLLECTION_NAME.PLAYER,
  playerSchema,
)

export default {
  model: playerModel,
  schema: playerSchema,
}
