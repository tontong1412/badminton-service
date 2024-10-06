import getAll from './getAll'
import create from './create'
import getByID from './getByID'
import update from './update'
import getMyBooking from './getMyBooking'

import controllerErrorHandler from '../../libs/controllerErrorHandler'
import removeBooking from './remove'

export default {
  getAll: controllerErrorHandler(getAll),
  create: controllerErrorHandler(create),
  getByID: controllerErrorHandler(getByID),
  update: controllerErrorHandler(update),
  myBooking: controllerErrorHandler(getMyBooking),
  remove: controllerErrorHandler(removeBooking)
}