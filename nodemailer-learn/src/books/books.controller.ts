import {type Context, Hono} from 'hono'
import * as bookService from './books.service.js'


// const books = [
//     {book_id:1,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed:true},
//     {book_id:2,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed: false}
// ]

// let nextID = 3

// get all books
export const getAllBooks = async (c:Context) => {
    const book = await bookService.getAllBookService();
    if(book.length === 0){
        return c.json({message:'Books not found'}, 404);
    }
    return c.json(book)
}

// get book by id
export const getBookById = async (c: Context) => {
    //create a variable to declare the id
   const book_id = parseInt(c.req.param('book_id'))
   try {
        const result = await bookService.getBookByIdService(book_id);
        if (result === null) {
            return c.json({ error: 'Book not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching book:', error);
        return c.json({ error: 'Failed to fetch book' }, 500);
    }
}

// create a new book
export const createBooks = async (c: Context) => {
    const body = await c.req.json() as {author:string,title:string,yop:string,genre:string}
    try{
        const result = await bookService.createBookService(body.author,body.title, body.yop, body.genre)
        if(result === "Book creation Success"){
            return c.json({message:result},201)
        }else{
            return c.json({error:"failed to create book"},500)
        }
    }catch (error){
        console.error('Failed to create book',error)
        return c.json({message:"failed to create"}, 500)
    }
}

//update that the book has been borrowed
//first check if the book exists in the db
export const updateBook = async (c: Context) => {
    const book_id = Number(c.req.param('book_id'))
    const body = await c.req.json() as {author:string,title:string,yop:string,genre:string, book_id:number}
    try{
       const checkIfBookExists = await bookService.getBookByIdService(book_id);
        if(checkIfBookExists === null){
            return c.json({message:"Book Not found"},404)
        }
        const result = await bookService.updateBookService(body.author ||'',body.title || '', body.yop || '', body.genre || '', book_id)
        if (result === "Book update Success") {
        return c.json({message: "Successfully updated book"}, 200);
        }
        return c.json({ message: result}, 200);
        } catch (error){
        console.error('Failed to update book try again',error)
        return c.json({message:"failed to update"}, 500)
    }
}


export const deleteBook = async(c:Context) => {
    const book_id = parseInt(c.req.param('book_id'))
    
    try {
        //check if book exists
        const check = await bookService.getBookByIdService(Number(book_id));
        if (check === null) {
            return c.json({ error: 'Book not found' }, 404);
        }
        //delete book
        const result = await bookService.deleteBookService(book_id);
        if (result === null) {
            return c.json({ error: 'Failed to delete book' }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting book:', error);
        return c.json({ error: 'Failed to delete book' }, 500);
    }
}

// Delete a todo by ID
// export const deleteBook= (c: Context) => {
//    const id = Number(c.req.param('book_id'))
//     const index = books.findIndex(b=> b.book_id === id)
//     if (index === -1) {
//         return c.json({ error: 'book not found' }, 404)
//     }
//     books.splice(index, 1)
//     return c.json({ message: 'book has been deleted' })
// }
