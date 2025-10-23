import {type Context, Hono} from 'hono'
import { auth } from 'hono/utils/basic-auth'
import { title } from 'process'

const bookRoutes = new Hono()

const books = [
    {book_id:1,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy"},
    {book_id:2,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy"}
]
let nextID = 3

bookRoutes.get('/json', (c) => {
  return c.json({message:'Hello from server'})
})

// get all books
bookRoutes.get('/books', (c) => {
    return c.json(books)
})

// get book by id
bookRoutes.get('/books/:id', (c: Context) => {
    const id = Number(c.req.param('id'))
    const book = books.find(b => b.book_id === id)
    if (!book) {
        return c.json({ error: 'Book not found' }, 404)
    }
    return c.json(book)
})

// Create a new book
bookRoutes.post('/books', async (c) => {
    const {author,title,yop,genre} = await c.req.json()
    const newBook = {
        book_id: nextID++,
        author:author,
        title: title,
        yop:yop,
        genre:genre   
    }
    books.push(newBook)
    return c.json({message:"Book created sucessfully", book:newBook}, 201)
})

//update that the book has been borrowed
bookRoutes.put('/books/:id', async (c) => {
    const borrowed = parseInt(c.req.param("id"))
    const book = books.find(b=>b.book_id === borrowed)
    if (!book) {
        return c.json({ error: 'Todo not found' }, 404)
    }
    if(!book){
    return c.json({message:`book not found`})
  }
  return c.json({borrowed:true, message:`Book has been borrowed`, book})
})

// Delete a todo
bookRoutes.delete('/books/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const index = books.findIndex(b=> b.book_id === id)
    if (index === -1) {
        return c.json({ error: 'book not found' }, 404)
    }
    books.splice(index, 1)
    return c.json({ message: 'book has been deleted' })
})

export default bookRoutes