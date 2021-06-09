import express from 'express'
import tournamentControllers from '../controllers/tournament'

const route = express.Router()

route.get('/', (req, res) => {
  res.status(200).send('This is badminton-service')
})

route.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

route.get('/tournament', tournamentControllers.getAll)
route.get('/tournament/:id([a-z0-9]+)', tournamentControllers.getByID)
route.post('/tournament', tournamentControllers.create)
route.put('/tournament/:id([a-z0-9]+)', tournamentControllers.update)
route.delete('/tournament/:id([a-z0-9]+)', tournamentControllers.remove)

export default route
