import {type Context, Hono} from 'hono'
import { getAllUsers,getUserById,createUser,updateUser,deleteUser} from './user.controller.ts'

const bookRoutes = new Hono()

// Get all users
bookRoutes.get('/books', getAllUsers)

// Get user by id
bookRoutes.get('/books/:user_id', getUserById)

// create book by id
bookRoutes.post('/books', createUser)

// update a borrowed book
bookRoutes.put('/books/:user_id', updateUser)

// delete a book
bookRoutes.delete('/books/:user_id', deleteUser)

export default userRoutes