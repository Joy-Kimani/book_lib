import { getDbConnectPool } from "../database/db.js"

interface UserResponse {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    user_type?: string;
    password: string;
}

//get all users
export const getAllUsersService = async (): Promise<UserResponse[] > => {
        const db = getDbConnectPool();; // Get existing connection instead of creating new one
        const result = await db.request().query('SELECT * FROM Users');
        return result.recordset;
}

//get user by user_id
export const getUserByIdService = async (user_id: number): Promise<UserResponse | null> => {
        const db = getDbConnectPool(); // Get existing connection
        const result = await db.request()
            .input('user_id', user_id)
            .query('SELECT * FROM Users WHERE user_id = @user_id');
        return result.recordset[0] || null;
}

//get user by email
export const getUserByEmailService = async (email: string): Promise<UserResponse | null> => {
    const db = getDbConnectPool(); // Get existing connection
    const result = await db.request()
        .input('email', email)
        .query('SELECT * FROM Users WHERE email = @email');
    return result.recordset[0] || null;
}
//create user service
export const createUserService = async (first_name:string,last_name:string,phone_number:string,email:string,password:string): Promise<string> => {
        const  db = getDbConnectPool();
        const result = await db.request()
            .input('first_name', first_name)
            .input('last_name', last_name)
            .input('phone_number', phone_number)
            .input('email', email)
            .input('password',password)
            .query('INSERT INTO Users (first_name, last_name, phone_number, email, password) OUTPUT INSERTED.*VALUES (@first_name, @last_name, @phone_number, @email, @password)')
       return result.rowsAffected[0] === 1 ? "Book creation Success" : "Failed to create book try again"
}

//update user by user_id
export const updateUserService = async (user_id:number, first_name:string,last_name:string,email:string,phone_number:string): Promise<UserResponse | null> => {
        const  db = getDbConnectPool();
        const result = await db.request()
            .input('first_name', first_name)
            .input('last_name', last_name)
            .input('phone_number', phone_number)
            .input('email', email)
            .query('UPDATE Users SET first_name = @first_name, last_name = @last_name, phone_number = @phone_number, email = @email OUTPUT INSERTED.* WHERE user_id = @user_id');
        return result.recordset[0] || null;
}

//delete user by user_id
export const deleteUserService = async (user_id:number): Promise<string> => {
        const db = getDbConnectPool(); // Get existing connection
        const query = 'DELETE FROM Users WHERE user_id = @user_id';
        const result = await db.request()
            .input('user_id', user_id)
            .query(query);
        return result.rowsAffected[0] === 1 ? "User deleted successfully" : "Failed to delete user";
}
