import arrange from './arrange'
import setScore from './setScore'
import getAll from './getAll'
import getByID from './getByID'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  arrange: controllerErrorHandler(arrange),
  setScore: controllerErrorHandler(setScore),
  getAll: controllerErrorHandler(getAll),
  getByID: controllerErrorHandler(getByID)

}
