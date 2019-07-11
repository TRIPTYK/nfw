import {Request, Response} from "express";
import {BaseSerializer} from "../serializers/base.serializer";

import * as Boom from "boom";
import {checkSchema, Location, Schema, ValidationChain} from "express-validator";
import {getRepository} from "typeorm";
import * as Pluralize from "pluralize";

export abstract class BaseMiddleware {

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
    public deserializeRelationships = (relations: { relation: string, model: string, additionalIncludes?: string[] }[] | string[] = []) => async (req: Request, _res: Response, next: Function) => {
        try {
            for (let i = 0; i < relations.length; i++) {
                let currentRelation = relations[i];
                let importModel;
                let includes = [];

                if (typeof currentRelation === "object") {
                    let {relation, model, additionalIncludes} = currentRelation;
                    importModel = await import(`../models/${model}.model`);
                    currentRelation = relation;
                    if (additionalIncludes)
                        includes = additionalIncludes;
                } else {
                    importModel = await import(`../models/${Pluralize.singular(currentRelation)}.model`);
                }

                importModel = Object.keys(importModel)[0];

                if (req.body.hasOwnProperty(currentRelation)) {
                    let relationData = null;

                    if (typeof req.body[currentRelation] === "string")
                        relationData = await getRepository(importModel).findOne(req.body[currentRelation], {relations: includes});
                    else if (Array.isArray(req.body[currentRelation]))
                        relationData = await getRepository(importModel).findByIds(req.body[currentRelation], {relations: includes});

                    if (!relationData) throw Boom.notFound('Related object not found');

                    req.body[currentRelation] = relationData;
                }
            }
            return next();
        } catch (e) {
            return next(e);
        }
    };

    /**
     * Deserialize a POST-PUT-PATCH-DELETE request
     *
     * @param nullEqualsUndefined
     */
    public deserialize = (nullEqualsUndefined: boolean = false) => async (req: Request, _res: Response, next: Function) => {
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

            return next();
        } catch (e) {
            return next(e);
        }
    }
}
