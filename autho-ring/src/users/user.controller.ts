import { type Context } from "hono"
import * as userServices from "./user.service.js";

//get all users
export const getAllUsers = async (c: Context) => {
    try {
        const result = await userServices.getAllUsersService();
        if (result.length === 0) {
            return c.json({ message: 'No users found' }, 404);
        }
        return c.json(result);
    } catch (error: any) {
        console.error('Error fetching users:', error.message);
        return c.json({ error: 'Failed to fetch users' }, 500);
    }
}

//get user by user_id
export const getUserById = async (c: Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    try {
        const result = await userServices.getUserByIdService(user_id);
        if (result === null) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching user:', error);
        return c.json({ error: 'Failed to fetch user' }, 500);
    }
}
//create users
export const createUser = async (c: Context) => {
    const body = await c.req.json() as {first_name:string,last_name:string,phone_number:string,email:string,password:string}
    try{
        const result = await userServices.createUserService(body.first_name,body.last_name,body.phone_number,body.email,body.password)
        if(result === "User creation Success"){
            return c.json({message:result},201)
        }else{
            return c.json({error:"failed to create user"},500)
        }
    }catch (error){
        console.error('Failed to create user',error)
        return c.json({message:"failed to create user"}, 500)
    }
}

//update user by user_id
export const updateUser = async (c: Context) => {
    try {
        const user_id = parseInt(c.req.param('user_id'))
        const body = await c.req.json()

        //check if user exists
        const checkExists = await userServices.getUserByIdService(user_id);
        if (checkExists === null) {
            return c.json({ error: 'User not found' }, 404);
        }
        const result = await userServices.updateUserService(user_id, body.first_name, body.last_name, body.email, body.phone_number);
        if (result === null) {
            return c.json({ error: 'Failed to update user' }, 404);
        }

        return c.json({ message: 'User updated successfully', updated_user: result }, 200);
    } catch (error) {
        console.error('Error updating user:', error);
        return c.json({ error: 'Failed to update user' }, 500);
    }
}

//delete user by user_id
export const deleteUser = async (c: Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    try {
        //check if user exists
        const check = await userServices.getUserByIdService(user_id);
        if (check === null) {
            return c.json({ error: 'User not found' }, 404);
        }

        //delete user if exists
        const result = await userServices.deleteUserService(user_id);
        if (result === null) {
            return c.json({ error: 'Failed to delete user' }, 404);
        }

        return c.json({ message: 'User deleted successfully', deleted_user: result }, 200);
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: 'Failed to delete user' }, 500);
    }
}
