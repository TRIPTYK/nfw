import { GeneratorParameters } from "../interfaces/generator.interface";
import project from "../utils/project";

export default function createTestTemplate({
    fileTemplateInfo
}: GeneratorParameters) {
    const file = project.createSourceFile(
        `${fileTemplateInfo.path}/${fileTemplateInfo.name}`,
        null,
        {
            overwrite: true
        }
    );

    file.addImportDeclaration({ moduleSpecifier: "chai" }).addNamedImport(
        "expect"
    );

    file.addImportDeclaration({
        moduleSpecifier: "supertest",
        namespaceImport: "supertest"
    });

    return file;
}
