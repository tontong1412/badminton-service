require('dotenv').config()

import MONGO from './mongo'

const CLOUDINARY = {
  PREFIX: process.env.CLOUDINARY_PREFIX
}

const NOTI = {
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
  EMAIL: process.env.EMAIL,
}

const {
  NODE_ENV,
  NODE_PORT,
  AUTH_SECRET,
  AUTH_ALGORITHM,
  CLIENT
} = process.env

export {
  NODE_ENV,
  NODE_PORT,
  MONGO,
  AUTH_SECRET,
  AUTH_ALGORITHM,
  CLIENT,
  CLOUDINARY,
  NOTI
}
