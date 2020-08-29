import project = require("../utils/project");
import { Scope } from "ts-morph";
import { GeneratorParameters } from "../interfaces/generator.interface";

/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
export default function createControllerTemplate({modelName,fileTemplateInfo,crudOptions,classPrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });

    file.addStatements((writer) => writer.writeLine("import Boom from '@hapi/boom';"));
    file.addStatements((writer) => writer.writeLine("import * as HttpStatus from 'http-status';"));
    file.addStatements((writer) => writer.writeLine("import {Request , Response} from \"express\";"));

    const controllerClass = file.addClass({
        name: `${classPrefixName}Controller`
    });

    controllerClass.setIsDefaultExport(true);

    controllerClass.addDecorator({
        name: "Controller",
        arguments: [`"${classPrefixName}"`]
    }).setIsDecoratorFactory(true);

    controllerClass.addDecorator({name: "RouteMiddleware", arguments: [`DeserializeMiddleware, ${classPrefixName}Serializer`]})
    controllerClass.addDecorator({name: "autoInjectable", arguments: []});

    const middlewareFunctionParameters = [
        { type : "Request" , name : "req" },
        { type : "Response" , name : "res" }
    ];

    controllerClass.addProperty({
        scope: Scope.Private,
        name: "repository",
        type: `${classPrefixName}Repository`
    });

    controllerClass.addConstructor({
        scope: Scope.Public,
        parameters: [{
            name: `private serializer?: ${classPrefixName}Serializer`,
        }],
        statements: [
            `this.repository = getCustomRepository(${classPrefixName}Repository);`
        ],
    });

    if(crudOptions.read) {

        const getMethod = controllerClass.addMethod({
            name: "get",
            parameters: middlewareFunctionParameters
        });

        getMethod.addJsDoc((writer) => {
            writer.writeLine(`@description GET ${classPrefixName} by id`);
            writer.writeLine("@throws {Boom.notFound()}");
            writer.writeLine("@return {any} result to send to client");
        });

        getMethod.toggleModifier("public").toggleModifier("async")
            .addStatements([
                `const ${classPrefixName} = await this.repository.jsonApiFindOne(req,req.params.id,${modelName}Relations);`,
                `if (!${classPrefixName}) { throw Boom.notFound("${classPrefixName} not found"); }`,
                `return this.serializer.serialize(${classPrefixName});`,
            ]);

        getMethod.addDecorator({
            name: "Get",
            arguments: ["\"/:id\""]
        });

        const listMethod = controllerClass.addMethod({
            name: "list",
            parameters: middlewareFunctionParameters
        });

        listMethod.addDecorator({
            name: "Get",
            arguments: ["\"/\""]
        });

        listMethod.toggleModifier("public").toggleModifier("async");
        listMethod.addStatements([
            `const [${classPrefixName}, total] = await this.repository.jsonApiRequest(req.query,${modelName}Relations).getManyAndCount();`,
            `if(req.query.page) {
                const page: PaginationQueryParams = req.query.page as any;
                return new ${classPrefixName}Serializer({
                    pagination: {
                        page: page.number,
                        size: page.size,
                        total: total,
                        url: req.url
                    }
                }).serialize(${classPrefixName});
            }`,
            `return this.serializer.serialize(${classPrefixName});`
        ]);

        listMethod.addJsDoc((writer) => {
            writer.writeLine(`@description LIST ${classPrefixName}`);
            writer.writeLine("@return {any} result to send to client");
        });

        const relatedMethod = controllerClass.addMethod({
            name: "fetchRelated",
            parameters: middlewareFunctionParameters
        });

        relatedMethod.toggleModifier("public").toggleModifier("async");

        relatedMethod.addStatements([
            "return this.repository.fetchRelated(req, this.serializer);"
        ]);

        relatedMethod.addDecorator({
            name: "Get",
            arguments: ["\"/:id/:relation\""]
        })

        relatedMethod.addJsDoc((writer) => {
            writer.writeLine(`@description Get related ${classPrefixName} entities`);
            writer.writeLine("@return");
        });

        const relationshipsMethod = controllerClass.addMethod({
            name: "fetchRelationships",
            parameters: middlewareFunctionParameters
        });

        relationshipsMethod.toggleModifier("public").toggleModifier("async");
        relationshipsMethod.addStatements([
            "return this.repository.fetchRelationshipsFromRequest(req, this.serializer);"
        ]);
        relationshipsMethod.addDecorator({
            name: "Get",
            arguments: ["\"/:id/relationships/:relation\""]
        });
        relationshipsMethod.addJsDoc((writer) => {
            writer.writeLine(`@description Get ${classPrefixName} relationships`);
            writer.writeLine("@return {array} of relationships id and type");
        });

    }

    if(crudOptions.create) {

        const createMethod = controllerClass.addMethod({
            name: "create",
            parameters: middlewareFunctionParameters
        });

        createMethod.toggleModifier("public").toggleModifier("async").addStatements([
            `const ${classPrefixName} = this.repository.create(req.body);`,
            `await this.repository.insert(${classPrefixName});`,
            "res.status(HttpStatus.CREATED);",
            `return this.serializer.serialize(${classPrefixName});`
        ]);

        createMethod.addDecorator({
            name: "Post",
            arguments: ["\"/\""]
        });

        createMethod.addDecorator({
            name: "MethodMiddleware",
            arguments: [`DeserializeRelationsMiddleware, { schema : ${classPrefixName}SerializerSchema }`]
        });

        createMethod.addDecorator({
            name: "MethodMiddleware",
            arguments: [`ValidationMiddleware, { schema: create${classPrefixName} }`]
        });

        createMethod.addJsDoc((writer) => {
            writer.writeLine(`@description CREATE ${classPrefixName}`);
            writer.writeLine("@return {any} result to send to client");
        });

        const addRelationshipsMethod = controllerClass.addMethod({
            name: "addRelationships",
            parameters: middlewareFunctionParameters
        });

        addRelationshipsMethod.toggleModifier("public").toggleModifier("async");
        addRelationshipsMethod.addStatements([
            "await this.repository.addRelationshipsFromRequest(req);",
            "res.sendStatus(HttpStatus.NO_CONTENT).end();"
        ]);

        addRelationshipsMethod.addDecorator({
            name: "Post",
            arguments: ["\"/:id/relationships/:relation\""]
        });

        addRelationshipsMethod.addJsDoc((writer) => {
            writer.writeLine(`@description Add ${classPrefixName} relationships`);
            writer.writeLine("@return");
        });
    }

    if(crudOptions.update) {

        const updateMethod = controllerClass.addMethod({
            name: "update",
            parameters: middlewareFunctionParameters
        });

        updateMethod.toggleModifier("public").toggleModifier("async");
        updateMethod.addStatements([
            `let saved = await this.repository.preload({
                ...req.body, ...{id: req.params.id}
            } as any);`,
            `if (saved === undefined) {
                throw Boom.notFound("${classPrefixName} not found");
            }`,
            "saved = await this.repository.save(saved);",
            "return this.serializer.serialize(saved);"
        ]);

        updateMethod.addDecorator({
            name: "Patch",
            arguments: ["\"/:id\""]
        });

        updateMethod.addDecorator({
            name: "Put",
            arguments: ["\"/:id\""]
        });

        updateMethod.addDecorator({
            name: "MethodMiddleware",
            arguments: [`ValidationMiddleware, { schema: update${classPrefixName} }`]
        });

        const updateRelationshipsMethod = controllerClass.addMethod({
            name: "updateRelationships",
            parameters: middlewareFunctionParameters
        });

        updateRelationshipsMethod.toggleModifier("public").toggleModifier("async");
        updateRelationshipsMethod.addStatements([
            "await this.repository.updateRelationshipsFromRequest(req);",
            "res.sendStatus(HttpStatus.NO_CONTENT).end();"
        ]);

        updateRelationshipsMethod.addDecorator({
            name: "Patch",
            arguments: ["\"/:id/relationships/:relation\""]
        })

        updateRelationshipsMethod.addJsDoc((writer) => {
            writer.writeLine(`@description REPLACE ${classPrefixName} relationships`);
            writer.writeLine("@return");
        });
    }

    if(crudOptions.delete) {

        const deleteMethod = controllerClass.addMethod({
            name: "remove",
            parameters: middlewareFunctionParameters
        });

        deleteMethod.toggleModifier("public").toggleModifier("async");
        deleteMethod.addStatements([
            `const ${classPrefixName} = await this.repository.findOne(req.params.id);`,
            `if(!${classPrefixName}) {
                throw Boom.notFound();
            }`,
            `await this.repository.remove(${classPrefixName});`,
            "res.sendStatus(HttpStatus.NO_CONTENT).end();"
        ]);

        deleteMethod.addDecorator({
            name: "Delete",
            arguments: ["\"/:id\""]
        });

        deleteMethod.addJsDoc((writer) => {
            writer.writeLine(`@description DELETE ${classPrefixName}`);
            writer.writeLine("@throws {Boom.notFound}");
            writer.writeLine("@return {any} result to send to client");
        });

        const deleteRelationshipsMethod = controllerClass.addMethod({
            name: "removeRelationships",
            parameters: middlewareFunctionParameters
        });

        deleteRelationshipsMethod.toggleModifier("public").toggleModifier("async");
        deleteRelationshipsMethod.addStatements([
            "await this.repository.removeRelationshipsFromRequest(req);",
            "res.sendStatus(HttpStatus.NO_CONTENT).end();"
        ]);

        deleteRelationshipsMethod.addDecorator({
            name: "Delete",
            arguments: ["\"/:id/relationships/:relation\""]
        });

        deleteRelationshipsMethod.addJsDoc((writer) => {
            writer.writeLine(`@description DELETE ${classPrefixName} relationships`);
            writer.writeLine("@return");
        });
    }

    return file;
};
