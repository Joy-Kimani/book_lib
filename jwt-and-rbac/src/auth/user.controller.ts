import {type Context, Hono} from 'hono'
import * as userService from ''


// const books = [
//     {book_id:1,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed:true},
//     {book_id:2,author:"malcom gladwell",title:"some book written by him",yop:"2089",genre:"fantasy",borrowed: false}
// ]

// let nextID = 3

// get all books
export const getAllUsers = async (c:Context) => {
    const book = await userService.getAllUsersService();
    if(book.length === 0){
        return c.json({message:'User not found'}, 404);
    }
    return c.json(book)
}

// get book by id
export const getUserById = async (c: Context) => {
    //create a variable to declare the id
   const user_id = parseInt(c.req.param('user_id'))
   try {
        const result = await userService.getUserByIdService(user_id);
        if (result === null) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching user:', error);
        return c.json({ error: 'Failed to fetch user' }, 500);
    }
}

// create a new book
export const createUser = async (c: Context) => {
    const body = await c.req.json() as {author:string,title:string,yop:string,genre:string}
    try{
        const result = await userService.userService(body.author,body.title, body.yop, body.genre)
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

//update that the buser has bowwowed a book
//first check if the user exists in the db
export const updateUser = async (c: Context) => {
    const user_id = Number(c.req.param('user_id'))
    const body = await c.req.json() as {author:string,title:string,yop:string,genre:string, book_id:number}
    try{
       const checkIfUserExists = await userService.getUserByIdService(user_id);
        if(checkIfUserExists === null){
            return c.json({message:"Book Not found"},404)
        }
        const result = await userService.updateUserService(body.author ||'',body.title || '', body.yop || '', body.genre || '', book_id)
        if (result === "User update Success") {
        return c.json({message: "Successfully updated user"}, 200);
        }
        return c.json({ message: result}, 200);
        } catch (error){
        console.error('Failed to update user try again',error)
        return c.json({message:"failed to update user"}, 500)
    }
}


export const deleteUser = async(c:Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    
    try {
        //check if user exists
        const check = await userService.getBookByIdService(Number(user_id));
        if (check === null) {
            return c.json({ error: 'User not found' }, 404);
        }
        //delete book
        const result = await userService.deleteUserService(user_id);
        if (result === null) {
            return c.json({ error: 'Failed to delete user' }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: 'Failed to delete user' }, 500);
    }
}
