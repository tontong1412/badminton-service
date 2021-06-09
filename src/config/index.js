require('dotenv').config()

import MONGO from './mongo'

const {
  NODE_ENV,
  NODE_PORT,
} = process.env

export {
  NODE_ENV,
  NODE_PORT,
  MONGO,
}
