import update from './update'
import addOther from './addOther'
import removeOther from './removeOther'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  update: controllerErrorHandler(update),
  addOther: controllerErrorHandler(addOther),
  removeOther: controllerErrorHandler(removeOther)
}
