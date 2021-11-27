import express from 'express'
import cors from 'cors'
import { NODE_ENV, NODE_PORT } from './config'
import routes from './routes'
import './libs/mongo/getMongoConnect'
import './libs/authentication'

const server = express()

// Add headers before the routes are defined
server.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

server.use(
  express.json({ extended: false, limit: '50mb' }),
  express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }),
  cors(),
)
server.use(routes)

const appConnection = server.listen(process.env.PORT || NODE_PORT, () => console.info(`Server is listening on ${process.env.PORT || NODE_PORT}`))
