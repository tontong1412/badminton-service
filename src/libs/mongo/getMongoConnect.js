import mongoose from 'mongoose'
import { MONGO } from '../../config'

const {
  ENDPOINT,
  USERNAME,
  PASSWORD,
  DATABASE,
} = MONGO

mongoose.promise = global.promise
const uri = `${ENDPOINT}`
const options = {
  dbName: `${DATABASE}`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
}

mongoose.connect(uri, options)

mongoose.connection.once('open', () => {
  console.log('[connected] Mongo connection established.')
})

const connect = () => mongoose.connection

export default connect
