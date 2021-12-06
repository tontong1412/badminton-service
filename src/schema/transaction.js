import mongoose from 'mongoose'
import { MONGO, TRANSACTION } from '../constants'

const { Schema } = mongoose

const transactionSchema = new Schema({
  gangID: { type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.GANG },
  date: Date,
  payment: {
    code: String,
    name: String
  },
  courtFee: Number,
  shuttlecockUsed: Number,
  shuttlecockFee: Number,
  shuttlecockTotal: Number,
  total: Number,
  reciever: { type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
  status: {
    type: String,
    trim: true,
    default: TRANSACTION.STATUS.NOT_PAID,
    enum: [
      TRANSACTION.STATUS.NOT_PAID,
      TRANSACTION.STATUS.PENDING,
      TRANSACTION.STATUS.PAID,
    ],
  },
  reference: { type: Number, default: 0 },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: MONGO.COLLECTION_NAME.MATCH }],
  other: [{
    name: String,
    amount: Number
  }],
  totalOther: Number,
  slip: String,
}, {
  timestamps: { createdAt: true, updatedAt: true }
})

transactionSchema.pre('save', function (next) {
  this.model(MONGO.COLLECTION_NAME.TRANSACTION).find({
    gangID: this.gangID,
    date: this.date,
    payer: this.payer
  }, (err, docs) => {
    if (!docs.length) {
      next()
    } else {
      next(new Error('transaction exists'))
    }
  })
})

const transactionModel = mongoose.model(
  MONGO.COLLECTION_NAME.TRANSACTION,
  transactionSchema,
)

export default {
  model: transactionModel,
  schema: transactionSchema,
}
