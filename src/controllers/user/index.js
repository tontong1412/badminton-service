import register from './register'
import login from './login'
import getCurrentUser from './getCurrentUser'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  register: controllerErrorHandler(register),
  login: controllerErrorHandler(login),
  getCurrentUser: controllerErrorHandler(getCurrentUser),
}
