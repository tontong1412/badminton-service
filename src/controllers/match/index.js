import arrange from './arrange'
import setScore from './setScore'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import manageShuttlecock from './manageShuttlecock'
import getStat from './stat'
import getNextMatch from './getNextMatch'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  arrange: controllerErrorHandler(arrange),
  setScore: controllerErrorHandler(setScore),
  getAll: controllerErrorHandler(getAll),
  getByID: controllerErrorHandler(getByID),
  update: controllerErrorHandler(update),
  manageShuttlecock: controllerErrorHandler(manageShuttlecock),
  getStat: controllerErrorHandler(getStat),
  getNextMatch: controllerErrorHandler(getNextMatch)
}
