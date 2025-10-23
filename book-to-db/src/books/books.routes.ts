import {type Context, Hono} from 'hono'
import { getAllBooks,getBookById,updateBook,deleteBook, createBooks} from './books.controller.js'

const bookRoutes = new Hono()

// Get all todos
bookRoutes.get('/books', getAllBooks)

// Get book by id
bookRoutes.get('/books/:book_id', getBookById)

// create book by id
bookRoutes.post('/books', createBooks)

// update a borrowed book
bookRoutes.put('/books/:book_id', updateBook)

// delete a book
bookRoutes.delete('/books/:book_id', deleteBook)

export default bookRoutes