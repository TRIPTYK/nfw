import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../api/models/user.model";

export default class CreateAuthUserSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const authUser = await factory(User)().create({
            password : "123",
            email : "123@gmail.com"
        });
        return authUser;
    }
}