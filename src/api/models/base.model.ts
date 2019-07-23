import {IModelize} from "../interfaces/IModelize.interface";

export abstract class BaseModel implements IModelize {
    public constructor(payload: Object = {}) {
        Object.assign(this, payload);
    }
}