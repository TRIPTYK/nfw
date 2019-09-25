//import {IModelize} from "../interfaces/IModelize.interface";
import {IModelize} from "nfw-core";

export abstract class BaseModel implements IModelize {
    public constructor(payload: Object = {}) {
        Object.assign(this, payload);
    }
}