import express from 'express'
import cors from 'cors'
import { NODE_PORT } from './config'
import routes from './routes'
import './libs/mongo/getMongoConnect'
import './libs/authentication'

const server = express()
server.use(
  express.json({ extended: false, limit: '50mb' }),
  express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }),
  cors(),
)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  next();
})
server.use(routes)

const appConnection = server.listen(process.env.PORT || NODE_PORT, () => console.info(`Server is listening on ${process.env.PORT || NODE_PORT}`))
