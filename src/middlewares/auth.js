import jwt from 'express-jwt'
import { AUTH_SECRET } from '../config'

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req
  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }
  return null
}

const auth = {
  required: jwt({
    secret: AUTH_SECRET,
    userProperty: 'payload',
    algorithms: ['sha1', 'RS256', 'HS256'],
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: AUTH_SECRET,
    userProperty: 'payload',
    algorithms: ['sha1', 'RS256', 'HS256'],
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
}

export default auth
