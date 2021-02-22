import * as camelcase from "camelcase";
import * as pascalcase from "pascalcase";
import project from "../utils/project";

export default function createEnumsTemplate(
    name: string,
    enums: Array<string>
) {
    const file = project.createSourceFile(
        `src/api/enums/${camelcase(name)}.enum.ts`,
        null,
        {
            overwrite: true
        }
    );

    const enumDeclaration = file.addEnum({
        name: pascalcase(name)
    });

    enumDeclaration.setIsExported(true);

    enums.forEach((element) => {
        const member = enumDeclaration.addMember({
            name: pascalcase(element),
            value: element
        });
    });
}
