import express from 'express'
import cors from 'cors'
import { NODE_PORT } from './config'
import routes from './routes'
import './libs/mongo/getMongoConnect'

const server = express()
server.use(
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
)
server.use(routes)

const appConnection = server.listen(process.env.PORT || NODE_PORT, () => console.info(`Server is listening on ${process.env.PORT || NODE_PORT}`))
