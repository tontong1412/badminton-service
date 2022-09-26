import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import recentActivity from './recentActivity'

import claim from './claim'
import subscribe from './subscribe'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  claim: controllerErrorHandler(claim),
  recentActivity: controllerErrorHandler(recentActivity),
  subscribe: controllerErrorHandler(subscribe),
}
