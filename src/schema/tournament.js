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
  date: Date,
  image: String,
  numberOfCourt: Number,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.EVENT }],
}, { versionKey: false })

const tournamentModel = mongoose.model(
  MONGO.COLLECTION_NAME.TOURNAMENT,
  tournamentSchema,
)

export default {
  model: tournamentModel,
  schema: tournamentSchema,
}
