import mongoose from 'mongoose'
import { MONGO, MATCH, EVENT } from '../constants'

const SchemaModel = mongoose.Schema

const matchSchema = new SchemaModel({
  eventID: mongoose.Types.ObjectId,
  gangID: mongoose.Types.ObjectId,
  shuttlecockUsed: { type: Number, default: 0 },
  matchNumber: Number,
  eventName: String,
  teamA: {
    team: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.TEAM },
    scoreSet: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    scoreDiff: { type: Number, default: 0 },
    serving: Number,
    receiving: Number,
    isServing: Boolean
  },
  teamB: {
    team: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.TEAM },
    scoreSet: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    scoreDiff: { type: Number, default: 0 },
    serving: Number,
    receiving: Number,
    isServing: Boolean
  },
  level: { type: mongoose.Schema.Types.ObjectId },
  scoreLabel: [{ type: String, trim: true }],
  format: {
    type: String,
    trim: true,
    enum: [
      EVENT.FORMAT.ROUND_ROBIN,
      EVENT.FORMAT.SINGLE_ELIMINATION,
      // EVENT.FORMAT.DOUBLE_ELIMINATION,
    ],
  },
  round: Number,
  groupOrder: Number,
  eventOrder: Number,
  bracketOrder: Number,
  status: {
    type: String,
    default: MATCH.STATUS.WAITING,
    trim: true,
    enum: [
      MATCH.STATUS.WAITING,
      MATCH.STATUS.PLAYING,
      MATCH.STATUS.FINISHED
    ]
  },
  court: Number,
  date: Date,
  step: {
    type: String,
    trim: true,
    enum: [
      MATCH.STEP.GROUP,
      MATCH.STEP.KNOCK_OUT,
    ],
  },
  reference: { type: Number, default: 0 }
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

const matchModel = mongoose.model(
  MONGO.COLLECTION_NAME.MATCH,
  matchSchema,
)

export default {
  model: matchModel,
  schema: matchSchema,
}
