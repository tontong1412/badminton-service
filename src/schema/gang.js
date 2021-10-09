import mongoose from 'mongoose'
import { MONGO, GANG } from '../constants'

const SchemaModel = mongoose.Schema

const gangSchema = new SchemaModel({
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  coordinate: {
    latitude: Number,
    longitude: Number,
  },
  type: {
    type: String,
    trim: true,
    enum: [
      GANG.TYPE.ROUTINE,
      GANG.TYPE.NON_ROUTINE
    ]
  },
  startTime: Date,
  endTime: Date,
  isPrivate: { type: Boolean, default: false },
  image: String,
  numberOfCourt: Number,
  creator: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
  managers: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  courtFee: {
    type: {
      type: String,
      trim: true,
      enum: [
        GANG.COURT_FEE_TYPE.SHARE,
        GANG.COURT_FEE_TYPE.BUFFET,
      ],
    },
    amount: Number
  },
  shuttlecockFee: Number,
  payment: {
    code: String,
    name: String
  },
  queue: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.MATCH }],
  players: [{ type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER }],
  isActive: { type: Boolean, default: true },
  reference: { type: Number, default: 0 }
}, { versionKey: false })

const gangModel = mongoose.model(
  MONGO.COLLECTION_NAME.GANG,
  gangSchema,
)

export default {
  model: gangModel,
  schema: gangSchema,
}
