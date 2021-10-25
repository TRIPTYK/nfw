import { MikroORM } from "@mikro-orm/core";
import { createApplication } from "@triptyk/nfw-core";
import { UserController } from "./controllers/user.controller.js";
import { UserModel } from "./models/user.model.js";

(async() => {
    const orm = await MikroORM.init({
        entities: [UserModel],
        dbName: 'nfw',
        user: 'root',
        password: 'test123*',
        type: 'mysql'
    });

    const koaApp = await createApplication({
        controllers: [UserController],
        mikroORMConnection : orm,
        baseRoute: "/api/v1"
    });

    koaApp.listen(8000);
})()