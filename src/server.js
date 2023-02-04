import express from 'express'
import cors from 'cors'
import { NODE_PORT, CLIENT } from './config'
import routes from './routes'
import { Server } from "socket.io"
import { createServer } from "http"
import './libs/mongo/getMongoConnect'
import './libs/authentication'

const server = express()

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
})

server.use(
  express.json({ extended: false, limit: '50mb' }),
  express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }),
  cors(),
)
server.use(routes)

const httpServer = createServer(server)
const io = new Server(httpServer, {
  cors: {
    origin: [CLIENT],
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log(`Client with ID of ${socket.id} connected!`)
  io.sockets.emit('connected to socket', 'HelloWorld')
})
const appConnection = httpServer.listen(process.env.PORT || NODE_PORT, () => console.info(`Server is listening on ${process.env.PORT || NODE_PORT}`))
export default io.sockets
