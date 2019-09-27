import {Request, Response} from "express";
import {BaseSerializer} from "../serializers/base.serializer";

import Boom from "@hapi/boom";
import {checkSchema, Location, Schema, ValidationChain} from "express-validator";
import {getRepository} from "typeorm";
import {IMiddleware} from "../interfaces/IMiddleware.interface";

export abstract class BaseMiddleware implements IMiddleware {

    protected serializer: BaseSerializer;

    constructor(serializer: BaseSerializer) {
        this.serializer = serializer
    }

    public handleValidation = (schema: Schema, location: Location[] = ["body"]) => async (req: Request, _res, next) => {
        const validationChain: ValidationChain[] = checkSchema(schema, location);

        const res = await Promise.all(validationChain.map(validation => validation.run(req)));

        const errors = [];

        res.forEach((r) => {
            if (r.errors.length !== 0)
                errors.push(r.errors)
        });

        if (errors.length !== 0) {
            const error = Boom.badRequest('Validation error');
            error['errors'] = errors;
            return next(error);
        }
        return next();
    };

    // TODO : Better handle async for each relations
    public deserializeRelationships = async (recipient : object,payload : object,specificRelations : string[] = []) => {
        const schemaData = this.serializer.getSchemaData();
        let relations: object = schemaData['relationships'];

        if (specificRelations === []) {
            relations = specificRelations.map((rel) => relations[rel]);
        }

        for (let originalRel in relations) {
            if (payload.hasOwnProperty(originalRel)) { //only load when present
                let rel = relations[originalRel];
                const modelName = rel['type'];
                let importModel = await import(`../models/${modelName}.model`);
                importModel = Object.keys(importModel)[0];

                let relationData = null;

                if (typeof payload[originalRel] === "string")
                    relationData = await getRepository(importModel).findOne(payload[originalRel]);
                else if (Array.isArray(payload[originalRel]))
                    relationData = await getRepository(importModel).findByIds(payload[originalRel]);

                if (!relationData) throw Boom.notFound('Related object not found');

                recipient[originalRel] = relationData;
            }
        }
    };

    /**
     * Deserialize a POST-PUT-PATCH-DELETE request
     *
     * @param nullEqualsUndefined
     * @param withRelationships
     * @param specificRelationships
     */
    public deserialize = ({nullEqualsUndefined = false,withRelationships = true,specificRelationships = []}: { nullEqualsUndefined?: boolean, withRelationships?: boolean, specificRelationships? : string[]} = {}) => async (req: Request, _res: Response, next: Function) => {
        try {
            if (['GET', 'DELETE'].includes(req.method)) return next();
            if (!req.body.data || !req.body.data.attributes) return next();
            let fields = this.serializer.deserialize(req);
            req.body = {};

            for (let key in fields) {
                if (key !== 'id')
                    if (nullEqualsUndefined && fields[key] === null)
                        delete req.body[key];
                    else
                        req.body[key] = fields[key];
                else
                    delete req.body[key];
            }

            if (withRelationships)
                await this.deserializeRelationships(req.body,req.body,specificRelationships);

            return next();
        } catch (e) {
            return next(e);
        }
    }
}
