import {Request, Response} from "express";
import * as Boom from "@hapi/boom";
import {checkSchema, Location, Schema, ValidationChain} from "express-validator";
import {getRepository} from "typeorm";
import { BaseSerializer } from "../serializers/base.serializer";

export interface IMiddleware {
    use(req: Request, res: Response, next: () => void, args: any);
}

export abstract class BaseMiddleware implements IMiddleware {
    public use(req: Request, res: Response, next: () => void, args: any) {
        return next();
    }

    /*
    public handleValidation = (schema: Schema, location: Location[] = ["body"]) => async (req: Request, resp, next) => {
        const validationChain: ValidationChain[] = checkSchema(schema, location);

        const res = await Promise.all(validationChain.map((validation) => validation.run(req)));

        const errors = [];

        for (const r of res) {
            if (r.errors.length !== 0) {
                errors.push(r.errors);
            }
        }

        if (errors.length !== 0) {
            const error = Boom.badRequest("Validation error");
            error["errors"] = errors;
            return next(error);
        }

        return next();
    }

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

    /**
     * Deserialize a POST-PUT-PATCH-DELETE request
     *
     * @param nullEqualsUndefined
     * @param withRelationships
     * @param specificRelationships
     */
    /**
    public deserialize = (
        {nullEqualsUndefined = false, withRelationships = true, specificRelationships = []}:
        { nullEqualsUndefined?: boolean, withRelationships?: boolean, specificRelationships?: string[]} = {}) =>
        async (req: Request, res: Response, next) => {
        try {
            if (["GET", "DELETE"].includes(req.method)) {
                return next();
            }
            if (!req.body.data || !req.body.data.attributes) {
                return next();
            }

            const fields = this.serializer.deserialize(req);
            req.body = {};

            for (const key in fields) {
                if (key !== "id") {
                    if (nullEqualsUndefined && fields[key] === null) {
                        delete req.body[key];
                    } else {
                        req.body[key] = fields[key];
                    }
                } else {
                    delete req.body[key];
                }
            }

            if (withRelationships) {
                await this.deserializeRelationships(req.body, req.body, specificRelationships);
            }

            return next();
        } catch (e) {
            return next(e);
        }
    }
    **/
}
