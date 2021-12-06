import mongoose from 'mongoose'
import { MONGO, EVENT } from '../constants'

const SchemaModel = mongoose.Schema

var teamSchema = mongoose.Schema({
  team: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.TEAM },
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
  paymentStatus: {
    type: String,
    trim: true,
    enum: [
      EVENT.PAYMENT_STATUS.IDLE,
      EVENT.PAYMENT_STATUS.PENDING,
      EVENT.PAYMENT_STATUS.PAID
    ],
    default: EVENT.TEAM_STATUS.IDLE,
  }
}, {
  _id: false,
});

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
  teams: [teamSchema],
  limit: Number,
  seeded: Boolean,
  order: {
    group: [[{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.TEAM }]],
    knockOut: [{ type: SchemaModel.Types.Mixed, ref: MONGO.COLLECTION_NAME.TEAM }]
  },
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

const eventModel = mongoose.model(
  MONGO.COLLECTION_NAME.EVENT,
  eventSchema,
)

export default {
  model: eventModel,
  schema: eventSchema,
}
