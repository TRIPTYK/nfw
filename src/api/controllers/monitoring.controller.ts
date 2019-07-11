//import * as HttpStatus from "http-status";

import {Request, Response} from "express";
import {BaseController} from "./base.controller";
import * as Osu from "node-os-utils";
import * as Os from "os";
import * as JSONAPISerializer from "json-api-serializer"

export class MonitoringController extends BaseController {
    /** */
    constructor() {
        super();
    }

    /**
     * Get the server ressources infos
     *
     * @param req Request
     * @param res Response
     *
     * @public
     */
    public async get(req: Request, res: Response, next: Function) {
        let ramInfo = {
            total: Os.totalmem(),
            free: Os.freemem(),
            used: (100 - ((Os.freemem() / Os.totalmem()) * 100)).toFixed(1)
        };

        let [os, cpuUsage, cpuFree, driveInfo] = await Promise.all([
            Osu.os.oos(),
            Osu.cpu.usage(),
            Osu.cpu.free(),
            Osu.drive.info(),
        ]);

        let resources = {
            id: "1",
            os,
            cpuCount: Osu.cpu.count(),
            cpuUsage,
            cpuFree,
            driveInfo,
            ramInfo
        };


        const serializer: JSONAPISerializer = new JSONAPISerializer();
        serializer.register("resources", {
            whitelist: ["os", "cpuCount", "cpuUsage", "cpuFree", "driveInfo", "ramInfo"]
        });

        return serializer.serialize(resources);
    }

    protected beforeMethod() {

    }
}
