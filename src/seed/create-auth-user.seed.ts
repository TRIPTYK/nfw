import { Seeder, Factory } from "typeorm-seeding";
import { User } from "../api/models/user.model";

export default class CreateAuthUserSeed implements Seeder {
    public async run(factory: Factory): Promise<any> {
        const authUser = await factory(User)().create({
            password : "admin",
            email : "admin@localhost.com"
        });
        return authUser;
    }
}

