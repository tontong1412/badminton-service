import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import addManager from './addManager'
import removeManager from './removeManager'
import getMyTournament from './getMyTournament'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  addManager: controllerErrorHandler(addManager),
  removeManager: controllerErrorHandler(removeManager),
  getMyTournament: controllerErrorHandler(getMyTournament),
}
