import express from 'express'
import tournamentControllers from '../controllers/tournament'
import gangControllers from '../controllers/gang'
import teamControllers from '../controllers/team'
import userControllers from '../controllers/user'
import eventControllers from '../controllers/event'
import playerControllers from '../controllers/player'
import matchControllers from '../controllers/match'
import authMiddlewares from '../middlewares/auth'
import transactionControllers from '../controllers/transaction'
import bannerControllers from '../controllers/banner'

const route = express.Router()

// general
route.get('/', (req, res) => { res.status(200).send('This is badminton-service') })
route.get('/healthz', (req, res) => { res.status(200).send('OK') })
route.post('/mock', (req, res) => res.status(200).send())

// user
route.post('/signup', authMiddlewares.optional, userControllers.signup)
route.post('/login', authMiddlewares.optional, userControllers.login)
route.get('/user/current', authMiddlewares.required, userControllers.getCurrentUser)

// player
route.get('/player', playerControllers.getAll)
route.get('/player/:id([a-z0-9]+)/recent-activity', playerControllers.recentActivity)
route.get('/player/:id([a-z0-9]+)', playerControllers.getByID)
route.post('/player', playerControllers.create)
route.put('/player/:id([a-z0-9]+)', authMiddlewares.required, playerControllers.update)
// route.delete('/player/:id([a-z0-9]+)', playerControllers.remove)

route.post('/player/claim', authMiddlewares.required, playerControllers.claim)

// tournament
route.get('/tournament', tournamentControllers.getAll)
route.get('/tournament/:id([a-z0-9]+)', tournamentControllers.getByID)
route.post('/tournament', authMiddlewares.required, tournamentControllers.create)
route.put('/tournament/:id([a-z0-9]+)', authMiddlewares.required, tournamentControllers.update)
// route.delete('/tournament/:id([a-z0-9]+)', tournamentControllers.remove)
route.post('/tournament/add-manager', authMiddlewares.required, tournamentControllers.addManager)
route.post('/tournament/remove-manager', authMiddlewares.required, tournamentControllers.removeManager)
route.post('/tournament/add-umpire', authMiddlewares.required, tournamentControllers.addUmpire)
route.post('/tournament/remove-umpire', authMiddlewares.required, tournamentControllers.removeUmpire)
route.get('/tournament/my-tournament', authMiddlewares.optional, tournamentControllers.getMyTournament)

// gang
route.get('/gang', authMiddlewares.optional, gangControllers.getAll)

route.post('/gang', authMiddlewares.required, gangControllers.create)
route.get('/gang/:id([a-z0-9]+)/bill', gangControllers.getAllBill)
route.put('/gang/:id([a-z0-9]+)', gangControllers.update)
// route.delete('/gang/:id([a-z0-9]+)', gangControllers.remove)
route.post('/gang/register', gangControllers.register)
route.post('/gang/add-queue', gangControllers.addQueue)
route.post('/gang/remove-queue', gangControllers.removeQueue)
route.get('/gang/bill', gangControllers.getBill)
route.get('/gang/:id([a-z0-9]+)', gangControllers.getByID)
route.post('/gang/update-queue', gangControllers.updateQueue)
route.post('/gang/close', gangControllers.close)
route.post('/gang/remove-player', gangControllers.removePlayer)
route.get('/gang/stat/:id([a-z0-9]+)', gangControllers.stat)
// route.delete('/gang/:id([a-z0-9]+)', tournamentControllers.remove)
route.get('/gang/my-gang', authMiddlewares.required, gangControllers.getMyGang)
route.post('/gang/add-manager', authMiddlewares.required, gangControllers.addManager)
route.post('/gang/remove-manager', authMiddlewares.required, gangControllers.removeManager)
route.post('/gang/add-member', authMiddlewares.required, gangControllers.addMember)
route.post('/gang/remove-member', authMiddlewares.required, gangControllers.removeMember)

// team
route.get('/team', teamControllers.getAll)
route.get('/team/:id([a-z0-9]+)', teamControllers.getByID)
route.post('/team', teamControllers.create)
route.put('/team/:id([a-z0-9]+)', teamControllers.update)
// route.delete('/team/:id([a-z0-9]+)', teamControllers.remove)

// event
route.get('/event', eventControllers.getAll)
route.get('/event/:id([a-z0-9]+)', eventControllers.getByID)
route.post('/event', eventControllers.create)
route.put('/event/:id([a-z0-9]+)', eventControllers.update)
route.delete('/event/:id([a-z0-9]+)', authMiddlewares.required, eventControllers.remove)

route.post('/event/register', authMiddlewares.required, eventControllers.register)
route.post('/event/leave', eventControllers.leave)
route.post('/event/random-order', eventControllers.randomOrder)
route.post('/event/round-up', eventControllers.roundUp)
route.post('/event/team', eventControllers.updateTeam)
route.post('/event/payment-status', eventControllers.updatePaymentStatus)
route.post('/event/shuttlecock-credit', eventControllers.updateShuttlecockCredit)


// match
route.get('/match', matchControllers.getAll)
route.get('/match/next', authMiddlewares.required, matchControllers.getNextMatch)
route.get('/match/:id([a-z0-9]+)/stat', matchControllers.getStat)
route.get('/match/:id([a-z0-9]+)', matchControllers.getByID)
route.post('/match/arrange', matchControllers.arrange)
route.put('/match/:id([a-z0-9]+)', matchControllers.update)
route.post('/match/set-score', matchControllers.setScore)
route.post('/match/manage-shuttlecock', matchControllers.manageShuttlecock)
route.get('/match/next', authMiddlewares.required, matchControllers.getNextMatch)

// transaction
route.put('/transaction/:id([a-z0-9]+)/add-other', transactionControllers.addOther)
route.put('/transaction/:id([a-z0-9]+)/remove-other', transactionControllers.removeOther)
route.put('/transaction/:id([a-z0-9]+)', transactionControllers.update)

// banner
route.get('/banner', bannerControllers.getAll)
route.post('/banner', bannerControllers.create)


export default route
