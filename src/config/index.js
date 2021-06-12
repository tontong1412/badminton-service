require('dotenv').config()

import MONGO from './mongo'

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
}
