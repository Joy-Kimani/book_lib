import bcrypt from "bcryptjs";
import { type Context } from "hono";
import { getUserByEmailService } from "../users/user.service.js";
import * as authServices from "./auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
//user
interface CreateUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    
}
//when they logim
interface LoginRequest {
    email: string;
    password: string;
}
//user credentials also known as payload
interface UserPayload {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'admin' | 'member';
}


//Register new user
export const createUser = async (c: Context) => {
    const body = await c.req.json() as CreateUserRequest;

    try {
        //check if user email exists
        const emailCheck = await getUserByEmailService(body.email);
        if (emailCheck !== null) {
            return c.json({ error: 'Email already exists ' }, 400);
        }

        //hash password
        const saltRounds = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(body.password, saltRounds);
        body.password = hashedPassword;
        // console.log("Hashed Password", hashedPassword)
        // console.log("Body to send to DB", body)

        //insert user with hashed password to DB
        const result = await authServices.createUserService(body.first_name, body.last_name, body.email, body.phone_number, body.password);
        if (result === "Failed to register user") {
            return c.json({ message: result }, 500);
        }
        return c.json({ message: result }, 201);
    } catch (error: any) {
        console.error('Error creating user:', error);
        return c.json({ error: error.message }, 500);
    }
}

export const loginUser = async (c: Context) => {
    const body = await c.req.json() as LoginRequest;
    try {
        //check if user email exists
        const existingUser = await getUserByEmailService(body.email);
        if (existingUser === null) {
            return c.json({ error: 'Invalid email or password 😟' }, 400);
        }

        //check if password is correct
        const isPasswordValid = bcrypt.compareSync(body.password, existingUser.password);
        if (!isPasswordValid) {
            return c.json({ error: 'Invalid email or password 😟' }, 400);
        }

        //generate and return token

        //generate payload
        const userType: UserPayload["user_type"] = existingUser.user_type === 'admin' ? 'admin' : 'member';
        const payload: UserPayload = {
            user_id: existingUser.user_id,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            email: existingUser.email,
            user_type: userType
        };

        //load our secret key
        const secretKey = process.env.JWT_SECRET_KEY as string;

        //generate token
        const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });

        //prepare user info to return
        const userInfo: UserPayload = {
            user_id: existingUser.user_id,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            email: existingUser.email,
            user_type: userType
        };

        //return token and user info
        return c.json({ message: 'Login successful ', token: token, userInfo: userInfo }, 200);

    } catch (error: any) {
        console.error('Error logging in user:', error);
        return c.json({ error: error.message }, 500);
    }
}