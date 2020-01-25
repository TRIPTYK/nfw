import { User } from "../models/user.model";

declare module 'express' {
    interface Request {
        user? : User
    }
}