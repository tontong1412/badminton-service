import express from 'express'
import tournamentControllers from '../controllers/tournament'
import userControllers from '../controllers/user'
import eventControllers from '../controllers/event'
import playerControllers from '../controllers/player'
import authMiddlewares from '../middlewares/auth'

const route = express.Router()

// general
route.get('/', (req, res) => { res.status(200).send('This is badminton-service') })
route.get('/healthz', (req, res) => { res.status(200).send('OK') })

// user
route.post('/signup', authMiddlewares.optional, userControllers.signup)
route.post('/login', authMiddlewares.optional, userControllers.login)
route.get('/user/current', authMiddlewares.required, userControllers.getCurrentUser)

// player
route.get('/player', playerControllers.getAll)
route.get('/player/:id([a-z0-9]+)', playerControllers.getByID)
route.post('/player', playerControllers.create)
route.put('/player/:id([a-z0-9]+)', playerControllers.update)
route.delete('/player/:id([a-z0-9]+)', playerControllers.remove)

// tournament
route.get('/tournament', tournamentControllers.getAll)
route.get('/tournament/:id([a-z0-9]+)', tournamentControllers.getByID)
route.post('/tournament', tournamentControllers.create)
route.put('/tournament/:id([a-z0-9]+)', tournamentControllers.update)
route.delete('/tournament/:id([a-z0-9]+)', tournamentControllers.remove)

// event
route.get('/event', eventControllers.getAll)
route.get('/event/:id([a-z0-9]+)', eventControllers.getByID)
route.post('/event', eventControllers.create)
route.put('/event/:id([a-z0-9]+)', eventControllers.update)
route.delete('/event/:id([a-z0-9]+)', eventControllers.remove)

route.post('/event/register', eventControllers.register)

export default route
