import { Body, Controller, GET, Param } from "@triptyk/nfw-core";

@Controller("/users")
export class UserController {
    @GET("/list/:id")
    public list(@Body() body : unknown, @Param("id") id: number) {
        console.log("body",body, id);
    }
}