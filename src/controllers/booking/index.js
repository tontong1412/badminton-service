import getAll from './getAll'
import create from './create'
import getByID from './getByID'
import update from './update'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  getAll: controllerErrorHandler(getAll),
  create: controllerErrorHandler(create),
  getByID: controllerErrorHandler(getByID),
  update: controllerErrorHandler(update),
}