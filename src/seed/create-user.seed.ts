import { Seeder, Factory } from "typeorm-seeding";
import { User } from "../api/models/user.model";

export default class CreateUsersSeed implements Seeder {
    public async run(factory: Factory): Promise<any> {
        await factory(User)().createMany(5);
    }
}
