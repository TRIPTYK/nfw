import {Request,Response} from "express";
import Boom from '@hapi/boom';
import * as HttpStatus from 'http-status';
import { Controller, SerializerParams } from "@triptyk/nfw-core";
import { SettingRepository } from "../repositories/setting.repository";
import { BaseController } from "./base.controller";
import { settingRelations } from "../enums/json-api/setting.enum";
import { SettingSerializer } from "../serializers/setting.serializer";
import { Setting } from "../models/setting.model";

@Controller({repository : SettingRepository})
export class SettingController extends BaseController {
    /**
     * @description GET setting by id
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async get(req: Request, res: Response, next: any) {
        const setting = await this.repository.jsonApiFindOne(req,req.params.id,settingRelations);
        if (!setting) { throw Boom.notFound(); }

        return new SettingSerializer().serialize(setting);
    }

    /**
     * @description LIST setting
     * @return {any} result to send to client
     *
     */
    public async list(req: Request, res: Response, next: any) {
        const [settings,total] = await this.repository.jsonApiRequest(req.query,settingRelations).getManyAndCount();
        return new SettingSerializer( new SerializerParams().enablePagination(req,total) ).serialize(settings);
    }

    /**
     * @description Get setting relationships
     * @return {array} of relationships id and type
     *
     */
    public async fetchRelationships(req: Request, res: Response, next: any) {
        return this.repository.fetchRelationshipsFromRequest(req,new SettingSerializer());
    }

    /**
     * @description Get related setting entities
     * @return
     *
     */
    public async fetchRelated(req: Request, res: Response, next: any) {
        return this.repository.fetchRelated(req,new SettingSerializer());
    }

    /**
     * @description CREATE setting
     * @return {any} result to send to client
     *
     */
    public async create(req: Request, res: Response, next: any) {
        const setting = new Setting(req.body);
        const saved = await this.repository.save(setting);
        res.status( HttpStatus.CREATED );
        return new SettingSerializer().serialize(saved);
    }

    /**
     * @description Add setting relationships
     * @return
     *
     */
    public async addRelationships(req: Request, res: Response, next: any) {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description UPDATE setting
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async update(req: Request, res: Response, next: any) {
        const setting = await this.repository.findOne(req.params.id);
        if (!setting) throw Boom.notFound();
        this.repository.merge(setting, req.body);
        const saved = await this.repository.save(setting);
        return new SettingSerializer().serialize(saved);
    }

    /**
     * @description REPLACE setting relationships
     * @return
     *
     */
    public async updateRelationships(req: Request, res: Response, next: any) {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE setting
     * @throws {Boom.notFound}
     * @return {any} result to send to client
     *
     */
    public async remove(req: Request, res: Response, next: any) {
        const setting = await this.repository.findOne(req.params.id);
        if (!setting) throw Boom.notFound();
        await this.repository.remove(setting);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    /**
     * @description DELETE setting relationships
     * @return
     *
     */
    public async removeRelationships(req: Request, res: Response, next: any) {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
