import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { MONGO } from '../constants'
import { AUTH_SECRET, AUTH_ALGORITHM } from '../config'

const SchemaModel = mongoose.Schema
const { Schema } = mongoose

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
  hash: String,
  salt: String,
  playerID: { type: SchemaModel.Types.ObjectId, ref: MONGO.COLLECTION_NAME.PLAYER },
})

userSchema.pre('save', function (next) {
  this.model('user').find({ email: this.email }, (err, docs) => {
    if (!docs.length) {
      next()
    } else {
      next(new Error('user exists'))
    }
  })
})

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, AUTH_ALGORITHM).toString('hex')
}

userSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, AUTH_ALGORITHM).toString('hex')
  return this.hash === hash
}

userSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    email: this.email,
    id: this._id,
    playerID: this.playerID,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, AUTH_SECRET)
}

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  }
}

const userModel = mongoose.model(
  MONGO.COLLECTION_NAME.USER,
  userSchema,
)

export default {
  model: userModel,
  schema: userSchema,
}
