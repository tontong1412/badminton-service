import create from './create'
import remove from './remove'
import getAll from './getAll'
import getByID from './getByID'
import update from './update'

import register from './register'
import leave from './leave'
import randomOrder from './randomOrder'
import roundUp from './roundUp'
import updateTeam from './updateTeam'
import updatePaymentStatus from './updatePaymentStatus'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  create: controllerErrorHandler(create),
  remove: controllerErrorHandler(remove),
  getByID: controllerErrorHandler(getByID),
  getAll: controllerErrorHandler(getAll),
  update: controllerErrorHandler(update),
  register: controllerErrorHandler(register),
  leave: controllerErrorHandler(leave),
  randomOrder: controllerErrorHandler(randomOrder),
  roundUp: controllerErrorHandler(roundUp),
  updateTeam: controllerErrorHandler(updateTeam),
  updatePaymentStatus: controllerErrorHandler(updatePaymentStatus)
}
