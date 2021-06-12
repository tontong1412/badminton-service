import express from 'express'
import tournamentControllers from '../controllers/tournament'
import userControllers from '../controllers/user'
import eventControllers from '../controllers/event'
import authMiddlewares from '../middlewares/auth'

const route = express.Router()

route.post('/register', authMiddlewares.optional, userControllers.register)
route.post('/login', authMiddlewares.optional, userControllers.login)
route.get('/user/current', authMiddlewares.required, userControllers.getCurrentUser)

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

route.get('/event', eventControllers.getAll)
route.get('/event/:id([a-z0-9]+)', eventControllers.getByID)
route.post('/event', eventControllers.create)
route.put('/event/:id([a-z0-9]+)', eventControllers.update)
route.delete('/event/:id([a-z0-9]+)', eventControllers.remove)

export default route
