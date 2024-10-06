import mongoose from 'mongoose'
import { MONGO, BOOKING } from '../constants'

const SchemaModel = mongoose.Schema


const bookingSchema = new SchemaModel({
  bookingRef: String,
  playerID: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },      // Reference to the user who booked
  date: Date,  // Date of the booking
  price: Number, // Price of the booking
  status: {
    type: String,
    trim: true,
    enum: [
      BOOKING.PAYMENT_STATUS.IDLE,
      BOOKING.PAYMENT_STATUS.PENDING,
      BOOKING.PAYMENT_STATUS.PAID,
      BOOKING.PAYMENT_STATUS.EXPIRED,
    ],
    default: BOOKING.PAYMENT_STATUS.IDLE,
  },
  isPublic: { type: Boolean, default: false },
  note: String,
  slip: String,
  name: String,
  venue: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.VENUE },
  slots: [{
    court: {
      _id: SchemaModel.Types.ObjectId,
      name: String
    },
    time: String,
    price: Number
  }],
  expiresAt: Date,
  isCustomer: { type: Boolean, default: true },
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true }
})

// Automatically set expiresAt to 5 minutes after createdAt
bookingSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(this.createdAt.getTime() + 10 * 60 * 1000); // Set to 10 minutes later
  }
  next();
});

bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: { $eq: 'idle' } } });

const bookingModel = mongoose.model(
  MONGO.COLLECTION_NAME.BOOKING,
  bookingSchema,
)

export default {
  model: bookingModel,
  schema: bookingSchema,
}
