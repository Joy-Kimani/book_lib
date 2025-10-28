import "dotenv/config";
import { type Next} from "hono";
import type { Context } from 'hono'
import jwt from "jsonwebtoken";

//representing the decoded JWT token payload
interface DecodedToken {
    user_id: number;           
    first_name: string;        
    last_name: string;         
    email: string;            
    user_type: 'admin' | 'member'; 
    iat: number;              
    exp: number;               
}

type UserRole = 'admin' | 'member' | 'both';

//This allows us to access user data throughout the request lifecycle
declare module "hono" {
    interface Context {
        user?: DecodedToken;
    }
}


export const verifyToken = async (token: string, secret: string): Promise<DecodedToken | null> => {
    try {
        // Verify and decode the JWT token 
        const decoded = jwt.verify(token, secret) as DecodedToken;
        return decoded;
    } catch (error: any) {
        // Return null for any verification errors
        console.error('Token verification failed:', error.message);
        return null;
    }
}


export const authMiddleware = async (c: Context, next: Next, requiredRole: UserRole) => {
    // Extract the Authorization header from the request
    const authHeader = c.req.header("Authorization");

    // Check if Authorization header is present
    if (!authHeader) {
        return c.json({ error: "Authorization header is required" }, 401);
    }

    // Validate that the header follows the Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Bearer token is required" }, 401);
    }

    // Extract the actual token by removing "Bearer " prefix (7 characters)
    const token = authHeader.substring(7);

    // Verify the token using our secret key from environment variables
    const decoded = await verifyToken(token, process.env.JWT_SECRET as string);

    // If token verification fails, return unauthorized error
    if (!decoded) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    // Check if user has the required role for this route
    if (requiredRole === "both") {
        // Allow access for both admin and user roles
        if (decoded.user_type === "admin" || decoded.user_type === "member") {
            c.user = decoded;  // Attach user data to context for use in route handlers
            return next();     // Proceed to the next middleware/route handler
        }
    } else if (decoded.user_type === requiredRole) {
        c.user = decoded;  // Attach user data to context
        return next();  
    }
    return c.json({ error: "Insufficient permissions to perform task" }, 403);
}

//admin
export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin");

//member
export const userRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "member");

//both roles 
export const bothRolesAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both");