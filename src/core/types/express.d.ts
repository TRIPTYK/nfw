import { User } from "../../api/models/user.model";

declare module "express" {
    interface Request {
        user? : any
    }
}
