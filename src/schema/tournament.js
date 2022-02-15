import mongoose from 'mongoose'
import { MONGO } from '../constants'
import { TOURNAMENT } from '../constants'

const SchemaModel = mongoose.Schema

const tournamentSchema = new SchemaModel({
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  coordinate: {
    latitude: Number,
    longitude: Number,
  },
  startDate: Date,
  endDate: Date,
  registerDate: Date,
  deadlineDate: Date,
  image: String,
  logo: String,
  poster: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.EVENT }],
  isPublished: Boolean,
  status: {
    type: String,
    trim: true,
    default: TOURNAMENT.STATUS.PREPARE,
    enum: [
      TOURNAMENT.STATUS.PREPARE,
      TOURNAMENT.STATUS.REGISTER,
      TOURNAMENT.STATUS.DRAW,
      TOURNAMENT.STATUS.ARRANGE,
      TOURNAMENT.STATUS.ONGOING,
      TOURNAMENT.STATUS.KNOCKOUT,
      TOURNAMENT.STATUS.FINISH,
    ],
  },
  registerOpen: Boolean,
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
  umpires: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  payment: {
    code: String,
    name: String,
    bank: String
  },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

const tournamentModel = mongoose.model(
  MONGO.COLLECTION_NAME.TOURNAMENT,
  tournamentSchema,
)

export default {
  model: tournamentModel,
  schema: tournamentSchema,
}
