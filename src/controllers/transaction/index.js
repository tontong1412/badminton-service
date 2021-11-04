import update from './update'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  update: controllerErrorHandler(update),
}
