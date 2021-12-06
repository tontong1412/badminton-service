require('dotenv').config()

import MONGO from './mongo'

const CLOUDINARY = {
  PREFIX: process.env.CLOUDINARY_PREFIX
}

const {
  NODE_ENV,
  NODE_PORT,
  AUTH_SECRET,
  AUTH_ALGORITHM,
} = process.env

export {
  NODE_ENV,
  NODE_PORT,
  MONGO,
  AUTH_SECRET,
  AUTH_ALGORITHM,
  CLOUDINARY
}
