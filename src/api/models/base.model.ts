import {IModelize} from "@triptyk/nfw-core";

export abstract class BaseModel implements IModelize {
    public constructor(payload: object = {}) {
        Object.assign(this, payload);
    }
}
