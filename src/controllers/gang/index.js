import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import register from './register'
import addQueue from './addQueue'
import removeQueue from './removeQueue'
import getBill from './getBill'
import updateQueue from './updateQueue'
import close from './close'
import removePlayer from './removePlayer'
import stat from './stat'
import getMyGang from './getMyGang'

import controllerErrorHandler from '../../libs/controllerErrorHandler'
import addManager from './addManager'
import removeManager from './removeManager'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  register: controllerErrorHandler(register),
  addQueue: controllerErrorHandler(addQueue),
  removeQueue: controllerErrorHandler(removeQueue),
  getBill: controllerErrorHandler(getBill),
  updateQueue: controllerErrorHandler(updateQueue),
  close: controllerErrorHandler(close),
  removePlayer: controllerErrorHandler(removePlayer),
  stat: controllerErrorHandler(stat),
  getMyGang: controllerErrorHandler(getMyGang),
  addManager: controllerErrorHandler(addManager),
  removeManager: controllerErrorHandler(removeManager)
}
