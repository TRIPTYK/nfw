import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request , Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { JSONAPISerializerSchema } from "../serializers/base.serializer";
import { getRepository } from "typeorm";
import * as Boom from "@hapi/boom";

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: {
        schema?: JSONAPISerializerSchema
        specificRelations?: string[]
    }) {
        const payload = req.body;
        const schemaData = args.schema;
        let relations: object = schemaData.relationships;

        if (Array.isArray(args.specificRelations)) {
            relations = args.specificRelations.map((rel) => relations[rel]);
        }

        const promises: Promise<void>[] = [];

        for (const originalRel in relations) {
            if (payload[originalRel]) {
                promises.push((async () => {
                    const rel = relations[originalRel];
                    const modelName = rel["type"];
                    let importModel = await import(`../models/${modelName}.model`);
                    [importModel] = Object.keys(importModel);

                    let relationData = null;

                    if (typeof payload[originalRel] === "string") {
                        relationData = await getRepository(importModel).findOne(payload[originalRel]);
                    } else if (Array.isArray(payload[originalRel])) {
                        relationData = await getRepository(importModel).findByIds(payload[originalRel]);
                    }

                    if (!relationData && payload[originalRel] !== null) {
                        throw Boom.notFound(`Related object not found for ${modelName}`);
                    }

                    req.body[originalRel] = relationData;
                })());
            }
        }

        await Promise.all(promises);

        return next();
    }
}
