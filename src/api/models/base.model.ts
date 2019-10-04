import {IModelize} from "@triptyk/nfw-core";

export abstract class BaseModel implements IModelize {
    public constructor(payload: Object = {}) {
        Object.assign(this, payload);
    }
}