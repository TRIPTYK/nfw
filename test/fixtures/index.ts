import * as faker from "faker";

export const user = (
    {username, email, password, lastname, firstname, role= "admin"}:
    {username?: string, email?: string, password?: string, lastname?: string, firstname?: string, services?: object, role?: "admin" | "user"}
    = {}) => {
    return {
        email : email ? email : faker.internet.email(),
        firstname : firstname ? firstname : faker.name.firstName(),
        lastname : lastname ? lastname : faker.name.lastName(),
        password : password ? password :  faker.internet.password(8, true),
        role : role ? role : "user",
        username : username ? username : faker.internet.userName()
    };
};