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
  level: Number,
  birthDate: Date,
  userID: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.USER },
  photo: String,
  lineID: String,
  tel: String,
  subscription: {
    endpoint: String,
    expirationTime: SchemaModel.Types.Mixed,
    keys: SchemaModel.Types.Mixed
  }
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

playerSchema.pre('save', async function (next) {
  // if no officialName means created from gang = don't care allow create
  if (!this.officialName) next()

  // check if officialName exist return error duplicate
  const docs = await this.model(MONGO.COLLECTION_NAME.PLAYER).find({ officialName: this.officialName })
  if (!docs.length) {
    next()
  } else {
    next(new Error('user exists'))
  }
})

const playerModel = mongoose.model(
  MONGO.COLLECTION_NAME.PLAYER,
  playerSchema,
)

export default {
  model: playerModel,
  schema: playerSchema,
}
