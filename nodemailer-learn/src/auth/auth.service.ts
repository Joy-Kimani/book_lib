import { getDbConnectPool } from "../database/db.js"

//create user
export const createUserService = async (first_name:string,last_name:string,email:string,phone_number:string,password:string): Promise<string> => {
        const db = getDbConnectPool();
        const result = await db.request()
            .input('first_name', first_name)
            .input('last_name', last_name)
            .input('email', email)
            .input('phone_number', phone_number)
            .input('password', password)
            .query('INSERT INTO Users (first_name, last_name, email, phone_number, password) OUTPUT INSERTED.* VALUES (@first_name, @last_name, @email, @phone_number, @password)');
        return result.rowsAffected[0] === 1 ? "User Registered successfully " : "Failed to register user";
}