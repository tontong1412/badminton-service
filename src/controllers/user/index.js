import signup from './signup'
import login from './login'
import getCurrentUser from './getCurrentUser'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  signup: controllerErrorHandler(signup),
  login: controllerErrorHandler(login),
  getCurrentUser: controllerErrorHandler(getCurrentUser),
}
