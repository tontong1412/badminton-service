require('dotenv').config()

const MONGO = {
  ENDPOINT: process.env.MONGO_ENDPOINT,
  USERNAME: process.env.MONGO_USERNAME,
  PASSWORD: process.env.MONGO_PASSWORD,
  DATABASE: process.env.MONGO_DATABASE,
}

export default MONGO
