import {Hono} from 'hono'
import * as authControllers from './auth.controller.js'

const authRoutes = new Hono()

// create new user
authRoutes.post('/auth/register', authControllers.createUser)

// user login
authRoutes.post('/auth/login', authControllers.loginUser)

export default authRoutes