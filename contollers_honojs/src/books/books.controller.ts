import {type Context, Hono} from 'hono'

const books = [
    {book_id:1,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed:true},
    {book_id:2,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed: false}
]

let nextID = 3

export const getAllBooks = (c: Context) => {
    return c.json(books)
}

// get book by id
export const getBookById = (c: Context) => {
    const book_id = Number(c.req.param('book_id'))
    const book = books.find(b => b.book_id === book_id)
    if (!book) {
        return c.json({ error: 'book has not been not found' }, 404)
    }
    return c.json(book)
}

// create a new book
export const createBook = async (c: Context) => {
    const {author,title,yop,genre} = await c.req.json()
    const newBook = {
        book_id: nextID++,
        author:author,
        title: title,
        yop:yop,
        genre:genre,
        borrowed: false
    }
    books.push(newBook)
    return c.json(newBook, 201)
}

//update that the book has been borrowed
export const updateBook = async (c: Context) => {
  const book_id = Number(c.req.param("book_id"))
  const book = books.find(b => b.book_id === book_id)
  if (!book) {
    return c.json({ message: "book not found" },404)
  }
  book.borrowed = true
  return c.json({ message: "book has been borrowed", book })
}


// Delete a todo by ID
export const deleteBook= (c: Context) => {
   const id = Number(c.req.param('book_id'))
    const index = books.findIndex(b=> b.book_id === id)
    if (index === -1) {
        return c.json({ error: 'book not found' }, 404)
    }
    books.splice(index, 1)
    return c.json({ message: 'book has been deleted' })
}
