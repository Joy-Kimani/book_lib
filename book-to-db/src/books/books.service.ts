import { getDbConnectPool } from "../database/db.js";
import bookRoutes from "./books.routes.js";


interface bookResponse{
    book_id: Number,
    author: string,
    title: string,
    yop: string,
    genre:string
}

//get all book
export const getAllBookService = async (): Promise<bookResponse[] > => {
    const db = getDbConnectPool(); // Get existing connection instead of creating new one
    const result = await db.request().query('SELECT * FROM book');
    return result.recordset;
}

//get book by id
export const getBookByIdService = async (book_id: number): Promise<bookResponse | null> => {
    const db = getDbConnectPool();
    const result = await db.request()
        .input('book_id', book_id)
        .query('SELECT * FROM book WHERE book_id = @book_id');
    return result.recordset[0] || null;
}

//create new book
export const createBookService = async (author:string,title:string,yop:string,genre:string, book_id:number): Promise<string> => {
    const db = getDbConnectPool(); 
    const result = await db.request()
        .input('book_id', book_id)
        .input('author', author)
        .input('title',title)
        .input('yop',yop)
        .input('genre', genre)
        .query('INSERT INTO book (book_id,author,title,yop, genre) OUTPUT INSERTED.* VALUES (@book_id, @author, @title, @yop, @genre)');
    return result.rowsAffected[0] === 1 ? "Book creation Success" : "Failed to create book try again"
}
// update a book by id
export const updateBookService = async (author:string,title:string,yop:string,genre:string, book_id:number): Promise<string> =>{
const db = getDbConnectPool();
    const result = await db.request()
        .input('book_id', book_id)
        .input('author', author)
        .input('title',title)
        .input('yop',yop)
        .input('genre', genre)
        .query('UPDATE book SET author = @author, title = @title, yop = @yop, genre = @genre WHERE book_id = @book_id');
    return result.rowsAffected[0] === 1 ? "Book update Success" : "Failed to update book try again"
}

export const deleteBookService = async (book_id:number): Promise<string> => {
    const db = getDbConnectPool();
    const result = await db.request()
        .input('book_id', book_id)
        .query('DELETE FROM book OUTPUT DELETED.* WHERE book_id = @book_id');
    return result.rowsAffected[0] === 1 ? "Book has been deleted successfully" : "Failed to delete"
}