import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import addManager from './addManager'
import removeManager from './removeManager'
import addUmpire from './addUmpire'
import removeUmpire from './removeUmpire'
import getMyTournament from './getMyTournament'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  addUmpire: controllerErrorHandler(addUmpire),
  removeUmpire: controllerErrorHandler(removeUmpire),
  addManager: controllerErrorHandler(addManager),
  removeManager: controllerErrorHandler(removeManager),
  getMyTournament: controllerErrorHandler(getMyTournament),
}
