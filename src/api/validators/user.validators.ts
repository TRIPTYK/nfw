import { Email, Schema, SchemaBase, String } from 'fastest-validator-decorators';

@Schema()
export class ValidatedUser extends SchemaBase {
    @String()
    public firstName!: string;

    @String()
    public lastName!: string;

    @Email()
    public email!: string;

    @String()
    public password!: string;
}
