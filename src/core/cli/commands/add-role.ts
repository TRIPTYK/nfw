import * as camelcase from "camelcase";
import * as pascalcase from "pascalcase";
import project from "../utils/project";

export default async function addRole(roleName: string): Promise<void> {
    const file = project.getSourceFileOrThrow("src/api/enums/role.enum.ts");

    const enumDeclaration = file.getEnum("Roles");

    const tmp = enumDeclaration.getMember(pascalcase(roleName));

    if (!tmp) {
        const member = enumDeclaration.addMember({
            name: pascalcase(roleName),
            value: camelcase(roleName)
        });
    } else {
        throw new Error(`${roleName} already exist`);
    }
}
