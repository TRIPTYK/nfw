import { define } from "typeorm-seeding";
import Faker from "faker";
import { User } from "../api/models/user.model";
import { Roles } from "../api/enums/role.enum";

define(User, (faker: typeof Faker) => {
    const user = new User({
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(8, true),
        role: Roles.Admin
    });

    return user;
});
