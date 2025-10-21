import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { title } from 'process' 

const app = new Hono()

let books = [
  {book_id:1,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy"},
  {book_id:2,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy"}
]
let nextID = 3
//root route
app.get('/', (c) => {
  return c.text('Hello this is a book library!')
})

app.get('/json', (c) => {
  return c.json({message:'Hello from server'})
})

app.get('/api/books',(c)=>{
  return c.json(books)
})

// Get a specific book using Id
app.get('/api/books/:id',(c)=>{
  const bookId = parseInt(c.req.param("id"))
  const book = books.find(b=>b.book_id === bookId)

  if(!book){
    return c.json({error:"Book not found",})
  }
  return c.json(book)
})

//add new book to repository
app.post('/api/books', async (c)=>{
  const {author,title,yop,genre} = await c.req.json()
  const newBook = {book_id:nextID++, author:author,title:title, yop:yop,genre:genre}
  books.push(newBook)
  return c.json({message:"book created successfully",book:newBook},201)
})

//update that the book has been borrowed
app.put('/api/books/:id', async (c)=>{
  const borrowed = parseInt(c.req.param("id"))
  const book = books.find(b=>b.book_id === borrowed)

  if(!book){
    return c.json({message:`book not found`})
  }
  return c.json({borrowed:true, message:`Book has been borrowed`, book})
})

//delete book from repository
app.delete('/api/books/:id',(c)=>{
  const bookId = parseInt(c.req.param("id"))
  const bookIndex = books.findIndex(b=>b.book_id === bookId)

  if(bookIndex === -1){
    return c.json({error:"Book not found"})
  }

  const deletedbook = books.splice(bookIndex,1)
  return c.json(deletedbook[0])
})
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
