import * as pascalcase from "pascalcase";
import project from "../utils/project";

export default async function removeRole(roleName: string): Promise<void> {
    const file = project.getSourceFileOrThrow("src/api/enums/role.enum.ts");

    const enumDeclaration = file.getEnum("Roles");

    const tmp = enumDeclaration.getMember(pascalcase(roleName));
    if (tmp) {
        const member = tmp.remove();
    }
}
