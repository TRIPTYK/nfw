import {Request, Response} from "express";
import {BaseController} from "./base.controller";
import * as Osu from "node-os-utils";
import * as Os from "os";
import * as JSONAPISerializer from "json-api-serializer";

export class MonitoringController extends BaseController {
    /**
     * Get the server ressources infos
     *
     * @param req Request
     * @param res Response
     *
     * @param next
     * @public
     */
    public async get(req: Request, res: Response, next) {
        const ramInfo = {
            free: Os.freemem(),
            total: Os.totalmem(),
            used: (100 - ((Os.freemem() / Os.totalmem()) * 100)).toFixed(1)
        };

        const [os, cpuUsage, cpuFree, driveInfo] = await Promise.all([
            Osu.os.oos(),
            Osu.cpu.usage(),
            Osu.cpu.free(),
            Osu.drive.info(),
        ]);

        const resources = {
            cpuCount: Osu.cpu.count(),
            cpuFree,
            cpuUsage,
            driveInfo,
            id: "1",
            os,
            ramInfo
        };


        const serializer: JSONAPISerializer = new JSONAPISerializer();
        serializer.register("resources", {
            whitelist: ["os", "cpuCount", "cpuUsage", "cpuFree", "driveInfo", "ramInfo"]
        });

        return serializer.serialize(resources);
    }
}
