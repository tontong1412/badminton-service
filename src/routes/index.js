import express from 'express'

const route = express.Router()

route.get('/', (req, res) => {
  res.status(200).send('This is badminton-service')
})

route.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

export default route
