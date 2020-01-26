export const user = (
    {username, email, password, lastname, firstname, services= {}, role= "admin"}:
    {username: string, email: string, password: string, lastname: string, firstname: string, services: object, role: "admin" | "user"}
    ) => {
    return {
        email,
        firstname,
        lastname,
        password,
        role,
        services,
        username
    };
};
