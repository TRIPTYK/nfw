import { Body, Controller, GET, Param, UseMiddleware } from "@triptyk/nfw-core";
import KoaRatelimit from "koa-ratelimit";
import { CurrentUser } from "../decorators/current-user.decorator.js";
import { createLogMiddleware } from "../middlewares/log.middleware.js";

@Controller("/users")
@UseMiddleware(KoaRatelimit({
    driver: 'memory',
    db: new Map(),
    duration: 5000,
    max: 2,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx) => ctx.ip,
}))
export class UserController {
    @GET("/list/:id")
    @UseMiddleware(createLogMiddleware(true))
    public list(
        @Body() body : unknown, 
        @Param("id") id: number,
        @CurrentUser(true) currentUser: string
    ) {
        console.log("body",body, id, currentUser);
    }
}