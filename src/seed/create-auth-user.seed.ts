import { Seeder, Factory } from "typeorm-seeding";
import { Document } from "../api/models/document.model";
import { User } from "../api/models/user.model";

export default class CreateAuthUserSeed implements Seeder {
    public async run(factory: Factory): Promise<any> {
        const document = await factory(Document)().create();
        const authUser = await factory(User)().create({
            id: 1,
            password: "admin",
            email: "admin@localhost.com",
            documents: [document]
        });

        return authUser;
    }
}
