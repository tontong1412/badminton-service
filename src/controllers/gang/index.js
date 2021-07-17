import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'
import register from './register'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  register: controllerErrorHandler(register),
}
