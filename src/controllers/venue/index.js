import getAllVenue from './getAll'
import createVenue from './create'
import getByIDVenue from './getByID'

import controllerErrorHandler from '../../libs/controllerErrorHandler'

export default {
  getAll: controllerErrorHandler(getAllVenue),
  create: controllerErrorHandler(createVenue),
  getByID: controllerErrorHandler(getByIDVenue),
}