import Boom from '@hapi/boom';
import { EntityRepository } from "typeorm";
import { Setting } from "../models/setting.model";
import { BaseRepository } from "./base.repository";

@EntityRepository(Setting)
export class SettingRepository extends BaseRepository<Setting> {
    constructor() {
        super();
    }
}
