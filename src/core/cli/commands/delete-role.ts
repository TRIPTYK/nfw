import * as pascalcase from "pascalcase";
import {
    ArrayLiteralExpression,
    Decorator,
    PropertyAccessExpression
} from "ts-morph";
import project from "../utils/project";

export default async function deleteRole(roleName: string): Promise<void> {
    const file = project.getSourceFileOrThrow("src/api/enums/role.enum.ts");

    const enumDeclaration = file.getEnum("Roles");

    const tmp = enumDeclaration.getMember(pascalcase(roleName));
    for (const referencedSymbol of tmp.findReferences()) {
        for (const reference of referencedSymbol.getReferences()) {
            if (reference.getSourceFile().getFilePath().match("controller")) {
                const args = reference
                    .getNode()
                    .getParentOrThrow()
                    .getParentOrThrow() as ArrayLiteralExpression;
                for (const e of args.getElements()) {
                    const tmp = e as PropertyAccessExpression;
                    if (tmp.getName() === roleName) {
                        args.removeElement(e);
                    }
                }

                const decorator = args
                    .getParentOrThrow()
                    .getParentOrThrow() as Decorator;

                if (decorator.getArguments()[1].getText() === "[]") {
                    decorator.remove();
                }
            }
        }
    }
    if (tmp) {
        const member = tmp.remove();
    }
}
