import { Email, Schema, SchemaBase, String} from "fastest-validator-decorators";
import { UserModel } from "../models/user.model.js";

@Schema()
 export class ValidatedUser extends SchemaBase {
    @String()
    public firstName!: string;

    @Email()
    public lastName!: string;

}



export const validateCreateUser = (user: UserModel) => {
    // console.log(user.data.attributes);

    // const entityToValidate = new createUserValidationSchema({user.firstName, lastName});
    // console.log(entityToValidate.validate())
}