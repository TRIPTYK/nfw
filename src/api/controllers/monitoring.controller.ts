//import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';
import * as Osu from "node-os-utils";
import * as Os from "os";
import * as util from 'util';
/**
 *
 */
export class MonitoringController extends BaseController {

  /** */
  constructor() { super(); }
  /**
   * Get the server ressources infos
   *
   * @param {Object}req Request
   * @param {Function}res Response
   *
   * @public
   */
  public async get(req: Request, res : Response) {
    let ramInfo = {
      total: Os.totalmem(),
      free: Os.freemem(),
      used: ((Os.freemem()/Os.totalmem())*100).toFixed(1)
    }
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
    }
    const serializer : JSONAPISerializer = new JSONAPISerializer("ressources",{attributes : ["os","cpuCount","cpuUsage","cpuFree","driveInfo","ramInfo"]});
    const RessourcesSerialized = serializer.serialize(ressources);
    res.json(RessourcesSerialized);
   }
}
