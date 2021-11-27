import express from 'express'
import cors from 'cors'
import { NODE_ENV, NODE_PORT } from './config'
import routes from './routes'
import './libs/mongo/getMongoConnect'
import './libs/authentication'

const server = express()
const whitelist = ['https://dev.badminstar.com', 'https://badminstar.com']
if (NODE_ENV === 'development') {
  whitelist.push('http://localhost:3000')
}
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
server.use(
  express.json({ extended: false, limit: '50mb' }),
  express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }),
  cors(corsOptions),
)
server.use(routes)

const appConnection = server.listen(process.env.PORT || NODE_PORT, () => console.info(`Server is listening on ${process.env.PORT || NODE_PORT}`))
