import mongoose from 'mongoose'
import { MONGO, EVENT } from '../constants'

const SchemaModel = mongoose.Schema

const eventSchema = new SchemaModel({
  name: { type: String, trim: true },
  level: { type: mongoose.Schema.Types.ObjectId },
  description: String,
  format: {
    type: String,
    trim: true,
    enum: [
      EVENT.FORMAT.ROUND_ROBIN,
      EVENT.FORMAT.SINGLE_ELIMINATION,
      EVENT.FORMAT.DOUBLE_ELIMINATION,
    ],
  },
  teams: [{
    players: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
    status: {
      type: String,
      trim: true,
      enum: [
        EVENT.TEAM_STATUS.IDLE,
        EVENT.TEAM_STATUS.REJECTED,
        EVENT.TEAM_STATUS.APPROVED,
      ],
      default: EVENT.TEAM_STATUS.IDLE,
    },
  }],
  limit: Number,
  seeded: Boolean,
  order: SchemaModel.Types.Mixed,
}, { versionKey: false })

const eventModel = mongoose.model(
  MONGO.COLLECTION_NAME.EVENT,
  eventSchema,
)

export default {
  model: eventModel,
  schema: eventSchema,
}
