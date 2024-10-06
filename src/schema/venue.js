import mongoose from 'mongoose'
import { MONGO } from '../constants'

const SchemaModel = mongoose.Schema

const courtSchema = new SchemaModel({
  name: { type: String, trim: true },
  description: String,
  pricing: [
    {
      day: String,       // Day of the week (e.g., "Monday")
      timeSlots: [
        {
          startTime: String, // Start time (e.g., "08:00")
          endTime: String,   // End time (e.g., "12:00")
          price: Number       // Price for the time slot
        }
      ]
    }
  ],

}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

const venueSchema = new SchemaModel({
  name: { type: String, trim: true },
  address: { type: String, trim: true },
  location: {
    type: {
      type: String,   // Must be 'Point'
      enum: ['Point'], // 'Point' is the only allowed value
      required: true
    },
    coordinates: [Number, Number]  // [longitude, latitude]
  },
  operatingHours: [
    {
      day: String,       // Day of the week (e.g., "Monday")
      openTime: String, // Opening time (e.g., "08:00")
      closeTime: String // Closing time (e.g., "22:00")
    }
    // Repeat for other days of the week
  ],
  image: String,
  numberOfCourt: Number,
  managers: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  creator: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
  payment: {
    code: String,
    name: String,
    bank: String,
    qrcode: String,
  },
  autoCheckSlip: {
    enable: { type: Boolean, default: false },
    api: String,
    apiKey: String,
  },

  members: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  contact: {
    name: String,
    tel: String,
    lineID: String
  },
  area: String,
  courts: [courtSchema]
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

const venueModel = mongoose.model(
  MONGO.COLLECTION_NAME.VENUE,
  venueSchema,
)

export default {
  model: venueModel,
  schema: venueSchema,
}
