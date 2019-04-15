"use strict";
//import * as HttpStatus from "http-status";
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const jsonapi_serializer_1 = require("jsonapi-serializer");
const Osu = require("node-os-utils");
const Os = require("os");
class MonitoringController extends base_controller_1.BaseController {
    /** */
    constructor() { super(); }
    /**
     * Get the server ressources infos
     *
     * @param req Request
     * @param res Response
     *
     * @public
     */
    async get(req, res, next) {
        try {
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
            let ressources = {
                id: "1",
                os,
                cpuCount: Osu.cpu.count(),
                cpuUsage,
                cpuFree,
                driveInfo,
                ramInfo
            };
            const serializer = new jsonapi_serializer_1.Serializer("ressources", { attributes: ["os", "cpuCount", "cpuUsage", "cpuFree", "driveInfo", "ramInfo"] });
            res.json(serializer.serialize(ressources));
        }
        catch (e) {
            next(e);
        }
    }
}
exports.MonitoringController = MonitoringController;
