import mongoose from 'mongoose'
import { MONGO } from '../constants'

const SchemaModel = mongoose.Schema
const { Schema } = mongoose

const bannerSchema = new Schema({
  name: String,
  imageUrl: { type: String, trim: true },
  link: String,
  startDate: Date,
  endDate: Date,
  contactName: String,
  lineID: String,
  tel: String,
  isActive: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

const bannerModel = mongoose.model(
  MONGO.COLLECTION_NAME.BANNER,
  bannerSchema,
)

export default {
  model: bannerModel,
  schema: bannerSchema,
}
