import mongoose from 'mongoose'
import { MONGO } from '../constants'

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
  numberOfCourt: Number,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.EVENT }],
  isPublished: Boolean,
}, { versionKey: false })

const tournamentModel = mongoose.model(
  MONGO.COLLECTION_NAME.TOURNAMENT,
  tournamentSchema,
)

export default {
  model: tournamentModel,
  schema: tournamentSchema,
}
