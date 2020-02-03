import { BaseMiddleware } from "./base.middleware";
import { Request , Response } from "express";
import { container, injectable } from "tsyringe";
import { BaseSerializer } from "../serializers/base.serializer";

@injectable()
export default class DeserializeMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: (err?: any) => void, args: any) {
        if (!req.body.data || !req.body.data.attributes) {
            return next();
        }

        const fields = (container.resolve(args) as BaseSerializer).deserialize(req);
        req.body = {};

        for (const key in fields) {
            if (key !== "id") {
                req.body[key] = fields[key];
            } else {
                delete req.body[key];
            }
        }

        return next();
    }

    /** 
    // TODO : Better handle async for each relations
    public deserializeRelationships = async (recipient: object, payload: object, specificRelations: string[] = []) => {
        const schemaData = this.serializer.getSchemaData();
        let relations: object = schemaData["relationships"];

        if (specificRelations.length > 0) {
            relations = specificRelations.map((rel) => relations[rel]);
        }

        const promises: Promise<void>[] = [];

        for (const originalRel in relations) {
            if (payload.hasOwnProperty(originalRel)) { // only load when present
                promises.push((async () => {
                    const rel = relations[originalRel];
                    const modelName = rel["type"];
                    let importModel = await import(`../models/${modelName}.model`);
                    importModel = Object.keys(importModel)[0];

                    let relationData = null;

                    if (typeof payload[originalRel] === "string") {
                        relationData = await getRepository(importModel).findOne(payload[originalRel]);
                    } else if (Array.isArray(payload[originalRel])) {
                        relationData = await getRepository(importModel).findByIds(payload[originalRel]);
                    }

                    if (!relationData && payload[originalRel] !== null) {
                        throw Boom.notFound("Related object not found");
                    }

                    recipient[originalRel] = relationData;
                })());
            }
        }

        return Promise.all(promises);
    }
    **/
}
