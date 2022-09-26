import getAll from './getAll'
import create from './create'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  getAll: controllerErrorHandler(getAll),
  create: controllerErrorHandler(create),
}
