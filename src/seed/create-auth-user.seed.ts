import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../api/models/user.model";

export class CreateAuthUserSeed implements Seeder {
    public async run(factory: Factory): Promise<any> {
        const document = await factory(Document)().create();
        const authUser = await factory(User)().create({
            id: "1",
            password: "admin",
            email: "admin@localhost.com",
        });

        return authUser;
    }
}
