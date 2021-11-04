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

@Schema()
export class ValidatedUserUpdate extends SchemaBase {
    @String()
    public id!:string;

    @String({ optional: true })
    public firstName!: string;

    @String({ optional: true })
    public lastName!: string;

    @Email({ optional: true })
    public email!: string;

    @String({ optional: true })
    public password!: string;
}
