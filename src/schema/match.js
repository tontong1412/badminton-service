import mongoose from 'mongoose'
import { MONGO, MATCH } from '../constants'

const SchemaModel = mongoose.Schema

const matchSchema = new SchemaModel({
  eventID: mongoose.Types.ObjectId,
  matchNumber: Number,
  teamA: {
    _id: mongoose.Types.ObjectId,
    player: [{ type: SchemaModel.Types.Mixed, ref: MONGO.COLLECTION_NAME.PLAYER }],
    scoreSet: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    scoreDiff: { type: Number, default: 0 },
  },
  teamB: {
    _id: mongoose.Types.ObjectId,
    player: [{ type: SchemaModel.Types.Mixed, ref: MONGO.COLLECTION_NAME.PLAYER }],
    scoreSet: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    scoreDiff: { type: Number, default: 0 },
  },
  level: { type: mongoose.Schema.Types.ObjectId },
  scoreLabel: [{ type: String, trim: true }],
  round: { type: Number, default: 0 },
  status: {
    type: String,
    default: MATCH.STATUS.WAITING,
    trim: true,
  },
  court: Number,
  date: Date,
}, { versionKey: false })

const matchModel = mongoose.model(
  MONGO.COLLECTION_NAME.MATCH,
  matchSchema,
)

export default {
  model: matchModel,
  schema: matchSchema,
}
