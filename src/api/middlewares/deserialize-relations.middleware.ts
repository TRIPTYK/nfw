import { BaseMiddleware } from "./base.middleware";
import { Request , Response } from "express";
import { injectable, container } from "tsyringe";
import { BaseSerializer } from "../serializers/base.serializer";
import { getRepository } from "typeorm";
import * as Boom from "@hapi/boom";
import { Type } from "../types/global";

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: (err?: any) => void, args: {
        serializer?: Type<BaseSerializer>,
        specificRelations?: string[]
    }) {
        const serializer = container.resolve(args.serializer);
        const payload = req.body;
        const schemaData = serializer.getSchemaData();
        let relations: object = schemaData["relationships"];

        if (Array.isArray(args.specificRelations)) {
            relations = args.specificRelations.map((rel) => relations[rel]);
        }

        const promises: Promise<void>[] = [];

        for (const originalRel in relations) {
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

        return next();
    }
}
